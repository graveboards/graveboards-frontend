import {MdLockOutline} from "react-icons/md";

interface ForbiddenPageProps {
    message?: string;
}

const ForbiddenPage = ({
    message = "You do not have permission to manage this queue.",
}: ForbiddenPageProps) => (
    <section className="flex min-h-80 flex-col items-center justify-center gap-2 px-6 text-center">
        <MdLockOutline className="size-10 text-tertiary-500" aria-hidden="true"/>
        <p className="text-sm font-semibold text-primary-500">403</p>
        <h1 className="text-2xl font-bold">Forbidden</h1>
        <p className="max-w-md text-tertiary-500">{message}</p>
    </section>
);

export default ForbiddenPage;
