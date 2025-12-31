function Team2() {
  return (
    <>
      <div id="our-team" className="my-5 h-full flex flex-col">
        <div className="flex flex-col items-center w-full justify-center">
          <h1 className="text-2xl md:text-4xl uppercase font-black dark:text-white text-white px-4 md:px-8 pb-2 md:pb-4 mb-2 md:mb-8 border-b-cyan-400 border-b-2">
            Our Team
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center w-auto gap-2 md:gap-4 mt-4 md:mt-8 border shadow-lg rounded-lg p-4 md:p-8">
            <img
              src="/assets/Faculty_Sponsor.jpg"
              alt="Faculty Sponsor"
              className="w-full md:w-auto md:h-1/4 h-auto rounded-lg shadow-lg"
            />
            <div className="text-base sm:text-xl md:text-2xl">
              <div className="flex items-center justify-center md:justify-start">
                <h2 className="flex items-center justify-center font-bold mb-2 md:mb-4 dark:text-white text-white border w-40 sm:w-56 p-2 rounded-md">
                  Faculty Sponsor
                </h2>
              </div>
              <div className="border p-2 md:p-4 rounded-md">
                <p className="dark:text-gray-300 text-white font-bold">
                  Dr. Prasanna Shete
                </p>
                <p className="dark:text-gray-300 text-white text-sm md:text-base">
                  Associate Professor at K J Somaiya School of Engineering
                </p>
                <p className="dark:text-gray-300 text-white text-sm md:text-base">
                  Email:{" "}
                  <span className="font-bold text-blue-700">
                    prasannashete@somaiya.edu
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Team2;
