import ProfileButton from "@/components/new/layout/topbar/profile-button";
import LoginButton from "@/components/new/layout/topbar/login-button";
import {verifySession} from "@/actions/session";

const AuthButton = async () => {
    const session = await verifySession();

    return session ? <ProfileButton/> : <LoginButton/>;
};

export default AuthButton;