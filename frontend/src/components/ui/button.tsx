import * as React from 'react';

type ClassValue = string | number | false | null | undefined;

function cn(...inputs: ClassValue[]) {
	return inputs.filter(Boolean).join(' ');
}

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
	size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
	default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
	secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400',
	outline: 'border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-400',
	ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-400',
	destructive: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

const sizeStyles: Record<ButtonSize, string> = {
	sm: 'h-9 rounded-md px-3 text-sm',
	md: 'h-10 rounded-md px-4 py-2',
	lg: 'h-11 rounded-md px-6 text-base',
	icon: 'h-10 w-10 rounded-md',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = 'default', size = 'md', type = 'button', disabled, ...props }, ref) => {
		return (
			<button
				ref={ref}
				type={type}
				disabled={disabled}
				className={cn(
					'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
					'disabled:pointer-events-none disabled:opacity-50',
					variantStyles[variant],
					sizeStyles[size],
					className,
				)}
				{...props}
			/>
		);
	},
);

Button.displayName = 'Button';

