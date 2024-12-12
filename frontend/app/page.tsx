import GoogleAuthBtn from "./components/icons/googleAuthBtn";
import Logo from "./components/icons/Logo/Logo";
import Pencil from "./components/icons/Pencil/Pencil";
import { TrashIcon, PrinterIcon } from "@heroicons/react/24/solid";
export default function Home() {
  return (
    <>
      Start estimate app
      <div className="bg-two">
        <div>
          <Logo width={"74"} height={"74"} />
        </div>
        <div className="pencil">
          {" "}
          <Pencil width={"24"} height={"24"} />
        </div>
        <p className="text-red-300">jhkjhkjh</p>
        <GoogleAuthBtn />
        <PrinterIcon className="size-6 text-gray-800 hover:text-gray-500" />
        <TrashIcon className="size-6 text-gray-800 hover:text-gray-500" />
      </div>
    </>
  );
}
