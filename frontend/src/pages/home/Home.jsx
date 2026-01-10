import Carousel from "./Carousel";
import RecentNews from "./RecentNews";
import VersityInfo from "./VersityInfo";

const Home = () => {
  return (
    <div className="relative w-full bg-light mb-5">
      <Carousel />
      {/* Additional content below carousel */}

      <VersityInfo />
      <RecentNews />
      {/* <SweetAlert />
      <ConfirmationAlert />
      <UserPrompt />
      <AutoCloseAlert /> */}
    </div>
  );
};

export default Home;
