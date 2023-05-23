import Aggregator from "../components/aggregator";
import Navbar from "../components/navbar";
import Swapmodal from "../components/swapmodal";

export default function Home() {
  return (
    <div className=" bg-gradient-to-r from-indigo-800 to-purple-900 w-full h-full">
      <Navbar />
      <Swapmodal />
      <Aggregator/>
    </div>
  );
}
