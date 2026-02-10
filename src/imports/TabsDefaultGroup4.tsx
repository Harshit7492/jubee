function Spacer() {
  return (
    <div className="absolute h-[40px] right-[-0.25px] top-0 w-[16px]" data-name="Spacer">
      <div className="absolute h-[32px] right-0 top-0 w-[16px]" data-name="spacer" />
    </div>
  );
}

function Tab3() {
  return (
    <div className="absolute bottom-0 left-3/4 right-0 top-0" data-name="Tab 4">
      <div className="absolute bg-[#6f6f6f] h-[2px] left-0 right-[0.75px] top-[38px]" data-name="bar" />
      <Spacer />
      <p className="absolute font-['IBM_Plex_Sans:Regular',sans-serif] leading-[18px] left-[16px] not-italic right-[15.75px] text-[#c6c6c6] text-[14px] top-[12px] tracking-[0.16px] whitespace-pre-wrap">Tab label</p>
    </div>
  );
}

function Spacer1() {
  return (
    <div className="absolute h-[40px] right-[-0.25px] top-0 w-[16px]" data-name="Spacer">
      <div className="absolute h-[32px] right-0 top-0 w-[16px]" data-name="spacer" />
    </div>
  );
}

function Tab2() {
  return (
    <div className="absolute bottom-0 left-1/2 right-1/4 top-0" data-name="Tab 3">
      <div className="absolute bg-[#6f6f6f] h-[2px] left-0 right-[0.75px] top-[38px]" data-name="bar" />
      <Spacer1 />
      <p className="absolute font-['IBM_Plex_Sans:Regular',sans-serif] leading-[18px] left-[16px] not-italic right-[15.75px] text-[#c6c6c6] text-[14px] top-[12px] tracking-[0.16px] whitespace-pre-wrap">Tab label</p>
    </div>
  );
}

function Spacer2() {
  return (
    <div className="absolute h-[40px] right-[-0.25px] top-0 w-[16px]" data-name="Spacer">
      <div className="absolute h-[32px] right-0 top-0 w-[16px]" data-name="spacer" />
    </div>
  );
}

function Tab1() {
  return (
    <div className="absolute bottom-0 left-1/4 right-1/2 top-0" data-name="Tab 2">
      <div className="absolute bg-[#6f6f6f] h-[2px] left-0 right-[0.75px] top-[38px]" data-name="bar" />
      <Spacer2 />
      <p className="absolute font-['IBM_Plex_Sans:Regular',sans-serif] leading-[18px] left-[16px] not-italic right-[15.75px] text-[#c6c6c6] text-[14px] top-[12px] tracking-[0.16px] whitespace-pre-wrap">Tab label</p>
    </div>
  );
}

function Spacer3() {
  return (
    <div className="absolute h-[40px] right-[-0.25px] top-0 w-[16px]" data-name="Spacer">
      <div className="absolute h-[32px] right-0 top-0 w-[16px]" data-name="spacer" />
    </div>
  );
}

function Tab() {
  return (
    <div className="absolute h-[40px] left-0 right-3/4 top-0" data-name="Tab 1">
      <div className="absolute bg-[#3b83f6] h-[2px] left-0 right-[0.75px] top-[38px]" data-name="bar" />
      <Spacer3 />
      <p className="absolute font-['IBM_Plex_Sans:SemiBold',sans-serif] leading-[18px] left-[16px] not-italic right-[15.75px] text-[#f4f4f4] text-[14px] top-[12px] tracking-[0.16px] whitespace-pre-wrap">Tab label</p>
    </div>
  );
}

export default function TabsDefaultGroup() {
  return (
    <div className="relative size-full" data-name="tabs / default / group / 4">
      <Tab3 />
      <Tab2 />
      <Tab1 />
      <Tab />
    </div>
  );
}