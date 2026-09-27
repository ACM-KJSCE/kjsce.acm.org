import Event from "../components/Event";
import PageLayout from "../components/PageLayout";

const EventsSectionPage = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10">
        <Event />
      </div>
    </PageLayout>
  );
};

export default EventsSectionPage;
