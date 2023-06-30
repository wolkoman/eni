import Responsive from "./Responsive";

export function EniHero() {
  return <div className="relative overflow-hidden">
    <div
      className="absolute inset-0 bg-[url(/bg-grad-mobile.svg)] lg:bg-[url(/bg-grad.svg)] bg-center bg-cover animate-colorful"/>
    <Responsive>
      <div className="flex justify-between flex-col items-center relative">
        <div className="mt-20 mb-32 text-5xl leading-tight text-white text-center lg:mb-12">
          <span className="font-bold">Miteinander der Pfarren</span><br/>
          Emmaus, St.&nbsp;Nikolaus und Neustift
        </div>
        <div
          className="bg-[url(/logo/parish_all.svg)] bg-contain bg-no-repeat bg-bottom lg:w-[1300px] h-[150px] grow-0"/>
      </div>
    </Responsive></div>;
}