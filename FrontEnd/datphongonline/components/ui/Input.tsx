import { ReactNode } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    rightElement?: ReactNode;
}

export function Input({
    label,
    icon,
    rightElement,
    className = "",
    ...props
}: InputProps) {
    return (
        <div className="space-y-2">
            {label && (
                <div className="flex justify-between items-center ml-2">
                    <label className="text-[10px] uppercase font-bold text-stone-400 tracking-[0.2em]">
                        {label}
                    </label>
                    {rightElement}
                </div>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    className={`w-full bg-[#FCFAF7] rounded-2xl border border-stone-100 px-12 py-3.5 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-[#1E3932]/10 focus:border-[#1E3932] transition-all ${className}`}
                />
            </div>
        </div>
    );
}
