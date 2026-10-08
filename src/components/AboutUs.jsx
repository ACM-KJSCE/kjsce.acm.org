function AboutUs() {
  return (
    <div id="about-us" className='flex flex-col justify-center items-center p-8 md:mt-40 lg:mt-8 mt-[5rem] relative z-10'>
      <h1 className='text-4xl uppercase font-black text-white px-8 pb-4 mb-4 md:mb-8 border-b-cyan-400 border-b-2'>About Us</h1>
      <div className='flex flex-col md:flex-row justify-center md:items-center mb-16 w-full h-1/2'>
        <div className='flex flex-col justify-center items-center md:w-1/2 w-full'>
          <div className='md:text-6xl sm:text-3xl text-2xl text-center text-white mb-4 md:mb-0 md:mr-8 font-bold md:pb-4 tracking-tight'>
            Together <span className="text-cyan-400">We</span> Strive,
          </div>
          <div className='md:text-6xl sm:text-3xl text-2xl text-center text-white mb-4 md:mb-0 md:mr-8 font-bold md:pb-4 tracking-tight'>
            Together <span className="text-cyan-400">We</span> Achieve!
          </div>
        </div>

        <p className='text-xl md:text-2xl text-gray-300 md:w-1/2 text-justify font-medium mt-8 md:mt-0'>
          Welcome to KJSSE ACM, where caffeine fuels ideas, bugs are just happy accidents, and tech dreams take shape!
          We're the cool new kids on campus. From cracking code to cracking jokes, we're all about learning, growing, and making things happen.
          At KJSSE ACM, our mantra is simple: together we strive, together we achieve..... and maybe have a little too much fun along the way!
        </p>
      </div>
      <img src='acm_2025-26.jpeg' alt='About Us' className='about relative z-10 md:w-2/3 w-11/12 rounded-3xl md:mt-12 mt-0' />
    </div>
  )
}

export default AboutUs;