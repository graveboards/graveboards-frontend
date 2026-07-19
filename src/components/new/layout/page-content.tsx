import type {ComponentProps, FC} from "react";
import {cn} from "@/lib/utils";

const PageContent: FC<ComponentProps<"div">> = ({className, ...props}) => (
    <div className={cn("px-5 pb-5", className)} {...props}/>
);

export default PageContent;
