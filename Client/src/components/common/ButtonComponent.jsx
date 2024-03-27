const ButtonComponent = ({
  buttonStyle = "",
  handleClick,
  children,
  type = "button",
  ...props
}) => {
  const buttonClass =
    "bg-[#0295db] outline-none hover:bg-[white] mt-4 px-5 py-2 rounded-md text-white hover:text-[#0295db] border-2 border-[#0295db] transition-all duration-250 ease-in-out font-semibold  " +
    buttonStyle;
  // {buttonClass}
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default ButtonComponent;
