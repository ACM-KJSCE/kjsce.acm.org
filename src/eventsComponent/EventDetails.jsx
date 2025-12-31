import { useParams, useNavigate } from "react-router";
import events from "../data/events.json";

export default function EventDetails() {

  const params = useParams();
  let event = events.find((x) => x.code === params.eventName);

  return (
    <div className="flex flex-col w-full ">
      <BackButton/>
      <div className="flex flex-col lg:flex-row text-white ">
        <div className="w-full lg:w-[50%] h-auto mt-[100px] mb-auto ml-0 lg:ml-[20px] flex flex-col items-center lg:items-start">
          <img className="object-scale-down rounded-[5px] w-[80%] sm:w-[60%] lg:min-w-[30%] lg:max-w-[50%] ml-0 lg:ml-auto mr-0 lg:mr-[10%] hover:border-white border-[2px] cursor-pointer border-transparent duration-[1s]" 
          src={event?.imageUrl} draggable={false} alt={event?.title}/>
          {event?.sponsors ? (
            <div className="w-[80%] sm:w-[60%] lg:min-w-[30%] lg:max-w-[50%] ml-0 lg:ml-auto mr-0 lg:mr-[10%] mt-[10px]">
              <div className="text-center text-[18px] sm:text-[20px] font-semibold hover:underline cursor-pointer">
                SPONSORS
              </div>
              <div className="flex flex-wrap justify-center gap-4 align-middle">
                {event?.sponsors?.map((x, y) => (
                  <div className="w-[70px] sm:w-[90px] mt-auto mb-auto" key={y}>
                    <img src={x} className="hover:border-white border-[2px] cursor-pointer border-transparent duration-[1s] rounded-[5px]" draggable={false} alt="sponsor logo"/>
                  </div>
                ))}
              </div>
            </div>) : ("")}
        </div>
        <div className="w-full lg:w-[50%] mt-[80px] px-4 lg:px-0">
          <div className="text-[32px] sm:text-[48px] lg:text-[60px] font-semibold p-0 m-0 cursor-pointer hover:underline">
            {event?.title}
          </div>
          <div className="flex mb-[30px] mt-[30px] font-semibold h-fit flex-wrap">
            <div className="h-[50px] flex flex-col w-[50px] rounded-[5px] text-center font-semibold border-cyan-400 border-[2px] border-t-0">
              <div className="bg-cyan-400 rounded-t-[4px] uppercase">
                {event?.month}
              </div>
              <div className="">{event?.date}</div>
            </div>
            <div className="ml-[20px] rounded-[5px] hover:underline cursor-pointer">
              <div className="">
                {event?.fullDate} {event?.venue}
              </div>
              <div className="">{event?.time}</div>
            </div>
          </div>
          <div className="">
            <div className="text-cyan-400 font-semibold text-[24px] sm:text-[30px] hover:underline cursor-pointer mb-[10px]">
              About Event
            </div>
            <div className="text-[16px] sm:text-[18px] whitespace-pre-wrap leading-tight font-semibold">
              {event?.description}
            </div>
          </div>
        </div>
      </div>
     {event.gallery ?      <div className="w-full text-center py-[20px] flex flex-col">
        <div className="mb-[50px] text-[50px] font-semibold text-white sm:text-[60px]">Event Gallery</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[20px] px-[20px]">
          {event?.gallery?.map((x, y) => (
            <img key={y} src={x} className="w-full max-w-[300px] m-auto rounded-[5px] cursor-pointer hover:border-white border-[2px] border-transparent duration-300 mb-[40px]"/>
          ))}
        </div>
     </div>:""} 


    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="fixed">
      <button className="mt-[15px] ml-[15px] flex rounded-[5px] bg-white/5 backdrop-blur-md text-[15px] p-[5px] pl-[10px] pr-[10px] font-semibold text-white/80 border-[1px] border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 duration-300" onClick={()=>{
        navigate(-1)
      }}>
        ← Go Back
      </button>
    </div>
    
  );
}

