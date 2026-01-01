function AboutUs() {
  return (
    <div id="about-us" className='flex flex-col justify-center items-center p-8 md:mt-40 lg:mt-8 mt-[5rem]'>
      <h1 className='text-4xl uppercase font-black dark:text-white text-white px-8 pb-4 mb-4 md:mb-8 border-b-cyan-400 border-b-2'>About Us</h1>
      <div className='flex flex-col md:flex-row justify-center md:items-center mb-16 w-full h-1/2'>
        <div className='flex flex-col justify-center items-center md:w-1/2 w-full'>
          <div className='md:text-6xl sm:text-3xl text-2xl text-center dark:text-white text-white mb-4 md:mb-0 md:mr-8 font-bold md:pb-4'>
            Together <span className="text-cyan-400">We</span> Strive,
          </div>
          <div className='md:text-6xl sm:text-3xl text-2xl text-center dark:text-white text-white mb-4 md:mb-0 md:mr-8 font-bold md:pb-4'>
            Together <span className="text-cyan-400">We</span> Achieve!
          </div>
        </div>
        <div className="h-64 w-20 bg-blue-600 blur-[90px] absolute md:top-[35rem] top-[25rem] mt-96 left-0"></div>
        {/* <div className="h-64 w-20 bg-blue-600 blur-[90px] absolute top-[70rem] mt-96 right-0"></div> */}

        <p className='text-1xl md:text-2xl text-white md:w-1/2 text-justify'>
          Welcome to KJSSE ACM, where caffeine fuels ideas, bugs are just happy accidents, and tech dreams take shape!
          We're the cool new kids on campus. From cracking code to cracking jokes, we're all about learning, growing, and making things happen.
          At KJSSE ACM, our mantra is simple: together we strive, together we achieve..... and maybe have a little too much fun along the way!
        </p>
      </div>
        <img src='team.jpg' alt='About Us' className='relative z-10 md:w-2/3 w-11/12 rounded-2xl md:mt-12 mt-0 about' />
    </div>
  )
}

export default AboutUs