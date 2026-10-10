import Event from "../components/Event";
import PageLayout from "../components/PageLayout";

const EventsSectionPage = () => {
  return (
    <PageLayout className="w-full overflow-x-hidden">
      <div className="w-full">
        <Event />
      </div>
    </PageLayout>
  );
};

export default EventsSectionPage;
