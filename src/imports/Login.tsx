import svgPaths from "./svg-pwt1nj7fy4";
import imgJubeeLogo1 from "@/assets/jubee-logo-main.png";

function JubeeLogo() {
  return (
    <div className="h-[112px] relative shrink-0 w-[149px]" data-name="Jubee Logo 1">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img alt="" className="absolute h-[148.84%] left-[-5.14%] max-w-none top-[-24.71%] w-[112.04%]" src={imgJubeeLogo1} />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-[487px]">
      <JubeeLogo />
      <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[#4a5565] text-[16px] text-center tracking-[-0.3125px]">Legal Case Management Platform</p>
    </div>
  );
}

function Heading() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[30px] left-0 not-italic text-[#101828] text-[20px] top-0 tracking-[-0.4492px]">Sign in to your account</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[20px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[20px] left-0 not-italic text-[#6a7282] text-[14px] top-[0.5px] tracking-[-0.1504px]">Enter your credentials to access the dashboard</p>
    </div>
  );
}

function LoginScreen() {
  return (
    <div className="h-[54px] relative shrink-0 w-full" data-name="LoginScreen">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] tracking-[-0.1504px]">Email Address</p>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-[#f3f3f5] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] tracking-[-0.1504px]">advocate@example.com</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Input />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic relative shrink-0 text-[#0a0a0a] text-[14px] tracking-[-0.1504px]">Password</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[#f3f3f5] h-[48px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[4px] relative size-full">
          <p className="css-ew64yg font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#717182] text-[14px] tracking-[-0.1504px]">Enter your password</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel1 />
      <Input1 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex font-['Inter:Medium',sans-serif] font-medium items-start justify-between not-italic relative shrink-0 text-[#101828] text-center w-full">
      <p className="css-ew64yg leading-[20px] relative shrink-0 text-[14px] tracking-[-0.1504px]">Sign in with OTP</p>
      <p className="css-ew64yg decoration-solid leading-[12px] relative shrink-0 text-[12px] underline">Forgot password?</p>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#101828] content-stretch flex h-[48px] items-center justify-center overflow-clip px-[196px] py-[9px] relative rounded-[8px] shrink-0 w-[437px]" data-name="Button">
      <div className="css-g0mm18 flex flex-col font-['Figtree:SemiBold',sans-serif] font-semibold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white">
        <p className="css-ew64yg leading-[16px]">Sign in</p>
      </div>
    </div>
  );
}

function LoginScreen1() {
  return (
    <div className="relative shrink-0 w-full" data-name="LoginScreen">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[16px] items-end relative w-full">
        <Container />
        <Container1 />
        <Frame1 />
        <Button />
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[113.422px]" data-name="Button">
      <p className="absolute css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[24px] left-[57px] not-italic text-[#101828] text-[16px] text-center top-[-0.5px] tracking-[-0.3125px] translate-x-[-50%]">Create account</p>
    </div>
  );
}

function LoginScreen2() {
  return (
    <div className="relative shrink-0 w-full" data-name="LoginScreen">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[57px] relative w-full">
          <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#4a5565] text-[14px] text-center tracking-[-0.1504px] w-[156px]">{`Don't have an account?`}</p>
          <Button1 />
        </div>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-white relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[25px] relative w-full">
        <LoginScreen />
        <LoginScreen1 />
        <LoginScreen2 />
      </div>
    </div>
  );
}

function Or() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="or">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 225.5 1">
            <path d="M225.5 0.5H0" id="Vector 1" stroke="var(--stroke-0, #D9D9D9)" />
          </svg>
        </div>
      </div>
      <p className="css-ew64yg font-['Inter:Medium',sans-serif] font-medium leading-[1.5] not-italic relative shrink-0 text-[#6e6e6e] text-[16px]">or</p>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 225.5 1">
            <path d="M225.5 0.5H0" id="Vector 1" stroke="var(--stroke-0, #D9D9D9)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[14.58%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.0001 17">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p2bb4600} fill="var(--fill-0, #4285F4)" fillRule="evenodd" id="Shape" />
          <path clipRule="evenodd" d={svgPaths.p84b7930} fill="var(--fill-0, #34A853)" fillRule="evenodd" id="Shape_2" />
          <path clipRule="evenodd" d={svgPaths.p9dbd500} fill="var(--fill-0, #FBBC05)" fillRule="evenodd" id="Shape_3" />
          <path clipRule="evenodd" d={svgPaths.p96a5f00} fill="var(--fill-0, #EA4335)" fillRule="evenodd" id="Shape_4" />
          <g id="Shape_5"></g>
        </g>
      </svg>
    </div>
  );
}

function Plus() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="plus">
      <Group />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-white h-[48px] relative rounded-[10px] shrink-0 w-full" data-name="button">
      <div aria-hidden="true" className="absolute border border-[#e6e8e7] border-solid inset-0 pointer-events-none rounded-[10px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.03)]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-center px-[8px] py-[16px] relative size-full">
          <p className="css-ew64yg font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[1.2] not-italic relative shrink-0 text-[#232323] text-[18px] tracking-[-0.18px]">Sign in with Google</p>
          <Plus />
        </div>
      </div>
    </div>
  );
}

function Form() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full" data-name="form">
      <Card />
      <Or />
      <Button2 />
    </div>
  );
}

function LoginScreen3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] items-start left-[476.5px] top-[80px] w-[487px]" data-name="LoginScreen">
      <Frame />
      <Form />
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-white relative rounded-[24px] size-full" data-name="Login">
      <LoginScreen3 />
    </div>
  );
}