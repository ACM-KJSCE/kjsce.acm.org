function Team2() {
  return (
    <>
      <div id="our-team" className="my-5 h-full flex flex-col">
        <div className="flex flex-col items-center w-full justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-4xl font-black uppercase tracking-tight text-white mb-10">
            Our <span className="text-cyan-400">Team</span>
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center w-auto gap-2 md:gap-4 md:mt-8 border border-gray-700 shadow-lg rounded-lg p-4 md:p-8 bg-[#141517]/50 backdrop-blur-sm">
            <img
              src="/assets/Faculty_Sponsor.jpg"
              alt="Faculty Sponsor"
              className="w-full md:w-auto md:h-1/4 h-auto rounded-lg shadow-lg"
            />
            <div className="text-base sm:text-xl md:text-2xl">
              <div className="flex items-center justify-center md:justify-start">
                <h2 className="flex items-center justify-center font-bold mb-2 md:mb-4 text-white border border-gray-700 w-40 sm:w-56 p-2 rounded-md bg-black/50">
                  Faculty Sponsor
                </h2>
              </div>
              <div className="border border-gray-700 p-2 md:p-4 rounded-md bg-black/50">
                <p className="text-white font-bold">
                  Dr. Prasanna Shete
                </p>
                <p className="text-gray-300 text-sm md:text-base">
                  Associate Professor at K J Somaiya School of Engineering
                </p>
                <p className="text-gray-300 text-sm md:text-base">
                  Email:{" "}
                  <span className="font-bold text-cyan-400">
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
