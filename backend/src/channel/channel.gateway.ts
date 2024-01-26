import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'
import { BaseGateway } from './base.gateway';
import { ChannelService } from './channel.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { ChannelRole } from 'src/channel-member/dto';
import { UserService } from 'src/user/user.service';
import { UpdateIsOnlineDto } from 'src/user/dto';
import { ChannelMember, User } from '@prisma/client';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/Chat',
    credential: true,
})

export class ChannelGateway extends BaseGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(private readonly channelService: ChannelService, private userService: UserService, private readonly chatg: ChatGateway, private readonly channelMember: ChannelMemberService) {
        super();
    }
    async handleDisconnect(socket: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            await this.channelService.handleDisconnection(socket.id);
            const clients = await this.userService.getClientsOfUser(user.id);
            if (clients.size === 0) {
                const data: UpdateIsOnlineDto = { is_online: false }
                await this.userService.updateIsOnline(user.id, data);

            }
        }
    }
    
    async handleConnection(socket: any) {
        if (socket) {
            await this.chatg.handleConnection(socket);
            const user = await this.userService.getUserOfClient(socket.id);
            if (user) {
                const data: UpdateIsOnlineDto = { is_online: true }
                await this.channelService.updateIsOnline(user.id, data);
            }
        }
    }
    @SubscribeMessage('DisconnectUser')
    async DisconnectUser(@ConnectedSocket() socket:Socket)
    {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            let clients = await this.userService.getClientsOfUser(user.id);
            if(clients && clients.size > 0)
            {
                clients.forEach((client:string) =>  this.userService.removeClient(client))
            }
            clients = await this.userService.getClientsOfUser(user.id);
            if (clients && clients.size === 0) {
                const data: UpdateIsOnlineDto = { is_online: false }
                await this.userService.updateIsOnline(user.id, data);

            }
        }
    }
    /****************************************CHannels*********************************************/
    @SubscribeMessage('AddChannel')
    async CreateChannel(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            await this.channelService.create(data, user, ChannelRole.OWNER, null);
            this.server.emit('goGetMychannels', await this.channelService.findAllNonDMChannels(user));
        }
    }
    @SubscribeMessage('GetMyChannels')
    async getmyChannels(@ConnectedSocket() socket: Socket) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            socket.emit('getchannels', await this.channelService.findAllNonDMChannels(user));
        }
    }
    @SubscribeMessage('GetMyDms')
    async getmyDms(@ConnectedSocket() socket: Socket) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            socket.emit('ShowDms', await this.channelService.findAllDMChannels(user));
        }
    }
    @SubscribeMessage('AddMessage')
    async create(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        try {
            const user = await this.userService.getUserOfClient(socket.id);
            if (user && await this.channelMember.getMemberDetails(data.channel_id, user.id)) {
                if (data && data.type === 'all' && await this.channelService.checkmute(user.id, data.channel_id) !== 'muted') {
                    await this.channelService.addMessage(data, user);
                    await this.server.to(data.channel_id).emit("GoGetMyMessages");
                }
                else if (data && data.type === 'Dms' && await this.channelService.check_blocked(user, data.target_id) !== "blocked") {
                    await this.channelService.addMessage(data, user);
                    await this.server.to(data.channel_id).emit("GoGetMyMessages");
                }
            }
        }
        catch (err) {

        }
    }
    @SubscribeMessage('GetMyMessages')
    async GetMessages(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        try {
            const user = await this.userService.getUserOfClient(socket.id);
            if (user && data && data.channel_id) {
                socket.emit('findallmessages', await this.channelService.getMessagesByRoomId(data.channel_id, user))
            }
        }
        catch {
        }
    }
    @SubscribeMessage('JoinChannel')
    async joinChannel(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        const banned = await this.channelService.checkban(user, data.room_id);
        if (user && data && data.room_id && banned != 'ban'
            && await this.channelService.validateRoomPassword(user, data.password, data.room_id) === "password-correct") {
            if (!await this.channelMember.getMemberDetails(data.room_id, user.id)) {
                await this.channelService.addMember({
                    channel_id: data.room_id,
                    user_id: socket.id,
                    role: ChannelRole.MEMBER,
                    avatar: user.avatar,
                    username: user.username,
                }, user);
            }
            socket.join(data.room_id);
            const my_channel = await this.channelService.findOne(data.room_id);
            socket.emit("joined", my_channel);
            socket.emit("findallmessages", await this.channelService.getMessagesByRoomId(data.room_id, user));
            socket.emit('getchannels', await this.channelService.findAllNonDMChannels(user));
            this.server.to(data.room_id).emit("getMembers", await this.channelService.getChannelMembers(data.room_id));
        }
        else if (data && data.room_id, banned != 'ban') {
            socket.emit("requirePassword");
        }
    }
    @SubscribeMessage('FindMyMessages')
    async findAll(socket: Socket, room_id: string, user: User) {
        socket.to(room_id).emit('findallmessages', await this.channelService.getMessagesByRoomId(room_id, user))
    }
    @SubscribeMessage('getChannelMembers')
    async getChannelMembers(@ConnectedSocket() socket: Socket, @MessageBody() channel_id: string) {
        try {
            socket.emit("getMembers", await this.channelService.getChannelMembers(channel_id));
        }
        catch
        {

        }
    }
    @SubscribeMessage('Kick')
    async kick(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            await this.channelService.kickMember(user, data.channel_id, data.target_id);
        }
        await this.server.to(data.channel_id).emit("getMembers", await this.channelService.getChannelMembers(data.channel_id));
    }
    @SubscribeMessage('Ban')
    async Ban(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            await this.channelService.banMember(data.channel_id, data.target_id, user);
        }
        await this.server.to(data.channel_id).emit("getMembers", await this.channelService.getChannelMembers(data.channel_id));
    }
    @SubscribeMessage('Mute')
    async Mute(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {

        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            await this.channelService.muteMember(user, data.channel_id, data.target_id);
        }
    }
    @SubscribeMessage('SetRole')
    async SetRole(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            await this.channelService.setMemberRole(user, data.channel_id, data.target_id, data.role);
        }
        await this.server.to(data.channel_id).emit("getMembers", await this.channelService.getChannelMembers(data.channel_id));
    }
    @SubscribeMessage('removeChannel')
    async removeChannel(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            await this.channelService.removeChannel(data.channel_id, user);
        }
    }
    @SubscribeMessage('SetPassword')
    async SetPassword(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            await this.channelService.SetChannelPassword(data.channel_id, data.password, user);
            this.server.to(data.channel_id).emit("joined", await this.channelService.findOne(data.channel_id));
            this.server.emit('goGetMychannels', await this.channelService.findAllNonDMChannels(user));
        }
    }
    @SubscribeMessage('RemovePassword')
    async RemovePassword(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            await this.channelService.RemoveChannelPassword(user, data.channel_id);
            this.server.to(data.channel_id).emit("joined", await this.channelService.findOne(data.channel_id));
            this.server.emit('goGetMychannels', await this.channelService.findAllNonDMChannels(user));
        }
    }
    @SubscribeMessage('leaveChannel')
    async leaveChannel(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            await this.channelService.leaveMyChannel(user, socket, data.channel_id, data.target_id);
            socket.leave(data.channel_id);
        }
    }
    /***********************************_DMS_**************************************************/
    @SubscribeMessage('CreateDm')
    async CreateDm(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            if (data && data.target_id && await this.channelService.check_blocked(user, data.target_id) !== "blocked") {
                await this.channelService.handleDmChannel(data.target_id, user, socket)
            }
            else
                socket.emit("blocked");
        }
    }
    @SubscribeMessage('removeChat')
    async removeDm(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            if (data && data.channel_id) {
                await this.channelService.removeChannel(data.channel_id, user);
                this.server.emit('blocked', data.channel_id);
                socket.emit("getmyMembers", await this.channelService.getChannelMembers(data.channel_id));
                socket.leave(data.channel_id);
            }
        }
    }
    @SubscribeMessage('JoinDm')
    async joinDm(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {

        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            const dm_channel = await this.channelService.findChannelDm(user, data.target_id);
            if (dm_channel) {
                socket.join(dm_channel.id);
                socket.emit("joined", await this.channelService.findOne(dm_channel.id));
                socket.emit("findallmessages", await this.channelService.getMessagesByRoomId(dm_channel.id, user));
                socket.emit("getmyMembers", await this.channelService.getChannelMembers(dm_channel.id));
            }
        }
    }
    /***********************************_DMS_**************************************************/
    @SubscribeMessage('InviteToGame')
    async InviteToGame(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user && data  && data.target_id && await this.channelService.check_blocked(user, data.target_id) !== "blocked") {
            if (data && data.target_id && data.mode && (data.mode == "classic" || data.mode == "power"))
                await this.channelService.InviteToGame(user, data.target_id, data.mode);
        }
    }
    @SubscribeMessage('RejectReq')
    async RejectReq(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            if (data && data.id)
                return await this.channelService.RemoveInvite(user, data.id);
        }
    }
    @SubscribeMessage('FindAllInvites')
    async FindAllReq(@ConnectedSocket() socket: Socket) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            return await this.channelService.FindAllReq(user, socket);
        }
    }
    @SubscribeMessage('AcceptInvite')
    async AcceptInvite(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
        const user = await this.userService.getUserOfClient(socket.id);
        if (user) {
            if (data && data.id) {
                return await this.channelService.AcceptReq(socket, data.id, user);
            }
        }
    }
    /***********************************Invite To game**************************************************/
}
