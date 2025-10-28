interface LogoAProps {
  color?: string;
  className?: string;
}

export function LogoA({ color = "#FFDB0D", className = "" }: LogoAProps) {
  console.log('LogoA color:', color); // Debug
  return (
    <svg 
      width="29" 
      height="33" 
      viewBox="0 0 29 33" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M20.8247 29.5625C16.5 25.4375 12.375 25.4375 8.04714 29.5625L6.13982 31.2806C6.13982 31.2806 4.46848 33 3.2485 33C1.01013 33 -0.556426 30.8519 0.186879 28.8019L9.5997 2.8413C10.217 1.1389 11.8734 0 13.7322 0H15.1296C16.9877 0 18.6437 1.13805 19.2615 2.83956L28.6877 28.8009C29.432 30.851 27.8655 33 25.6267 33C24.4077 33 22.7367 31.2828 22.7367 31.2828L20.8247 29.5625ZM14.4366 19.8516C16.8562 19.8516 18.8177 17.947 18.8177 15.5977C18.8177 13.2483 16.8562 11.3438 14.4366 11.3438C12.0169 11.3438 10.0554 13.2483 10.0554 15.5977C10.0554 17.947 12.0169 19.8516 14.4366 19.8516Z" 
        fill={color}
      />
    </svg>
  );
}
