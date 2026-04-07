import * as React from "react";
import { cn } from "@/lib/utils";

interface CuratorNoteProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    children: React.ReactNode;
}

export function CuratorNote({ title, children, className, ...props }: CuratorNoteProps) {
    return (
        <div 
            className={cn(
                "curator-note p-6 rounded-2xl shadow-lg transition-transform hover:rotate-0 duration-300 ease-out",
                className
            )} 
            {...props}
        >
            {title && (
                <h4 className="font-serif text-xl font-bold mb-2 opacity-90">
                    {title}
                </h4>
            )}
            <div className="font-sans text-sm leading-relaxed opacity-80">
                {children}
            </div>
        </div>
    );
}