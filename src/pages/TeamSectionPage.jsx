import Team2 from "../components/Team2";
import TeamShowcase from "../components/TeamShowcase";
import PageLayout from "../components/PageLayout";

const TeamSectionPage = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-10">
        <Team2 />
        <TeamShowcase />
      </div>
    </PageLayout>
  );
};

export default TeamSectionPage;
