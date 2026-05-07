import { UserChat } from "./components/ChatContainer";
import { ShowMenu } from "./components/Menu";

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080705] text-stone-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(217,119,6,0.24),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(120,53,15,0.26),transparent_40%),linear-gradient(135deg,#080705,#15110c_45%,#050403)]" />

      <section className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 md:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <UserChat />
        <ShowMenu />
      </section>
    </main>
  );
}

export default App;
