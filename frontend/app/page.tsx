import GoogleAuthBtn from "./components/icons/googleAuthBtn";
import Logo from "./components/icons/Logo/Logo";
import Pencil from "./components/icons/Pencil/Pencil";

export default function Home() {
  return (

    <>Start estimate app
      <div className="bg-two">
        <div>
          <Logo width={"74"} height={"74"} />
        </div>
        <div className="pencil"> <Pencil width={"24"} height={"24"} /></div>
        <GoogleAuthBtn />

      </div>

    </>
  );
}
