import {MdSearchOff} from "react-icons/md";

const QueueNotFound = () => (
    <section className="flex min-h-80 flex-col items-center justify-center gap-2 px-6 text-center">
        <MdSearchOff className="size-10 text-tertiary-500" aria-hidden="true"/>
        <p className="text-sm font-semibold text-primary-500">404</p>
        <h1 className="text-2xl font-bold">Queue not found</h1>
        <p className="max-w-md text-tertiary-500">
            This queue does not exist or is not available to your account.
        </p>
    </section>
);

export default QueueNotFound;
