const emptyList: { [key: string]: string } = {
  sent: "No Invitation Sent",
  received: "No Invitation Received",
  friends: "No Friends",
  blocked: "No One Blocked",
};

interface Props {
  label: string;
}
const EmptyList = ({ label }: Props) => {
  return (
    <div
      className="flex justify-center items-center w-full h-20 rounded-lg shadow-lg shadow-black text-blue-950 font-bold text-xl"
      style={{ backgroundColor: "rgb(196, 226, 230, 0.5)" }}
    >
      {emptyList[label]}
    </div>
  );
};

export default EmptyList;
