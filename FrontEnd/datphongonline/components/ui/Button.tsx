import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: ReactNode;
    icon?: ReactNode;
}

export function Button({
    loading,
    children,
    icon,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={loading || disabled}
            className={`group w-full rounded-2xl bg-[#1E3932] hover:bg-[#2D4F3C] text-white py-4 font-bold tracking-widest shadow-xl shadow-green-900/10 transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2 ${className}`}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    {children}
                    {icon && (
                        <span className="group-hover:translate-x-1 transition-transform">
                            {icon}
                        </span>
                    )}
                </>
            )}
        </button>
    );
}
