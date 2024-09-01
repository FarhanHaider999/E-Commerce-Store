const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center space-x-4 my-4">
      <div className={`${step1 ? "text-green-500" : "text-gray-300"} flex items-center`}>
        <span className="ml-2">Login</span>
        <div className="ml-2 mt-2 text-lg text-center">{step1 ? "✅" : "⬤"}</div>
      </div>

      <div className="flex items-center">
        <div className={`${step1 ? "h-0.5 w-[10rem] bg-green-500" : "h-0.5 w-[10rem] bg-gray-300"}`}></div>
        <div className={`${step2 ? "text-green-500" : "text-gray-300"} flex items-center`}>
          <span className="ml-2">Shipping</span>
          <div className="ml-2 mt-2 text-lg text-center">{step2 ? "✅" : "⬤"}</div>
        </div>
      </div>

      <div className="flex items-center">
        <div className={`${step2 ? "h-0.5 w-[10rem] bg-green-500" : "h-0.5 w-[10rem] bg-gray-300"}`}></div>
        <div className={`${step3 ? "text-green-500" : "text-gray-300"} flex items-center`}>
          <span className="ml-2">Summary</span>
          <div className="ml-2 mt-2 text-lg text-center">{step3 ? "✅" : "⬤"}</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
