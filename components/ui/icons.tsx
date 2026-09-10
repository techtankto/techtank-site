import { SVGProps } from "react";

// Every icon here is presentational: the surrounding copy carries the meaning. Hidden
// by default; props spread last, so a call site can pass aria-hidden={false} and a name.

export function LumaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

export function MeetupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 192 192" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M37 25.0092C63.4723 14.099 112.028 1.56643 146.287 11.306C163.906 16.3148 179.899 35.273 182.965 55.4691C185.505 72.2047 179.014 91.3382 170.043 101.02C169.385 101.73 169.035 102.672 169.101 103.638C169.124 103.979 169.203 104.326 169.326 104.644C181.719 136.509 162.275 151.899 140.12 156.222C117.433 160.649 95.2794 168.245 73.9717 177.12H73.9697L73.9688 177.121C52.1305 186.234 20.8442 176.833 10.2783 153.424C4.30451 140.189 8.52537 120.936 13.3428 107.305C13.9285 105.648 13.5934 103.808 12.5244 102.413C8.55753 97.2362 5.44083 91.0815 3.50098 84.142C-4.12034 56.8745 12.8208 34.9743 37 25.0092ZM114.908 61.1654C108.635 54.23 97.5422 53.1172 89.1426 60.889C87.5139 62.396 84.529 62.0475 82.9668 60.4711C77.9484 55.406 68.7616 54.3419 61.0439 57.4388C54.6646 59.9987 49.541 65.8629 46.4541 74.8617C46.4541 74.8617 40.8604 96.4003 36.0732 109.507C28.4968 131.95 61.6053 138.415 68.1221 117.38L77.5176 84.4242C79.001 79.6444 81.2458 75.5336 85.7549 76.6791C90.2641 77.8247 90.5048 82.4569 88.7295 87.4388L84.333 105.623C80.3124 120.146 100.736 124.067 105.059 110.756L112.11 84.4242C113.514 79.3615 116.038 76.393 119.691 77.1556C123.345 77.9191 124.455 81.0511 123.011 86.1049L119.125 101.447C116.571 110.27 118.876 117.604 127.767 119.03C137.461 120.584 143.551 116.511 145.627 114.789C146.172 114.339 146.489 113.692 146.606 112.994C146.839 111.616 145.772 110.378 144.379 110.339C140.707 110.239 138.456 109.677 137.643 107.31C137.021 105.501 136.802 103.545 137.924 99.6078C138.898 96.1892 141.373 87.2989 143.187 80.7699C145.212 73.4811 148.028 65.1583 141.291 59.3959C135.635 54.5581 126.831 55.947 119.946 61.6263C118.479 62.8369 116.185 62.577 114.908 61.1654Z" />
      <path d="M31.5185 5.48149C12.5894 6.95477 6.73902 25.6945 11.3055 25.6945C23.4298 25.6945 72.9003 2.26069 31.5185 5.48149Z" />
      <path d="M126.123 182.709C153.626 181.998 161.081 165.17 154.675 163.914C137.203 160.488 64.0647 184.315 126.123 182.709Z" />
    </svg>
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function SlackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function QrCodeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 740 740" fill="currentColor" aria-hidden="true" {...props}>
      <rect x="380" y="80" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="80" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="80" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="80" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="100" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="100" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="100" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="100" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="100" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="120" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="120" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="120" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="120" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="120" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="120" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="120" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="120" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="140" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="140" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="140" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="140" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="140" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="140" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="140" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="160" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="160" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="160" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="160" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="160" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="160" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="160" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="180" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="180" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="180" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="180" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="180" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="180" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="180" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="180" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="200" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="200" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="200" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="200" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="200" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="200" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="200" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="220" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="220" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="220" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="220" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="220" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="220" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="220" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="220" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="220" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="220" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="80" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="120" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="140" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="160" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="180" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="200" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="520" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="240" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="80" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="100" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="140" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="220" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="520" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="260" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="120" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="140" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="200" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="220" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="280" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="80" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="120" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="140" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="160" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="500" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="520" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="640" y="300" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="80" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="100" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="140" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="200" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="500" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="520" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="320" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="80" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="100" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="160" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="220" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="500" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="340" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="100" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="140" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="180" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="200" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="640" y="360" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="100" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="120" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="140" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="160" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="520" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="640" y="380" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="80" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="120" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="160" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="180" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="200" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="400" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="80" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="100" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="120" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="160" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="500" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="640" y="420" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="80" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="200" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="220" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="440" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="80" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="160" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="180" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="220" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="500" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="520" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="640" y="460" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="80" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="120" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="200" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="220" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="500" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="520" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="480" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="500" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="520" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="520" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="640" y="540" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="360" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="500" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="520" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="640" y="560" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="580" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="580" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="580" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="580" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="580" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="500" y="580" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="580" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="600" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="600" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="600" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="600" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="600" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="540" y="600" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="600" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="620" y="600" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="260" y="620" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="620" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="340" y="620" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="620" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="420" y="620" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="620" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="620" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="620" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="620" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="640" y="620" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="240" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="280" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="300" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="320" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="380" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="400" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="440" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="460" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="480" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="500" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="520" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="560" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="580" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <rect x="600" y="640" width="20" height="20" fill="currentColor" shapeRendering="crispEdges"></rect>
      <path
        d="M80 80 H192.0 A28.0 28.0 0 0 1 220 108.0 V192.0 A28.0 28.0 0 0 1 192.0 220 H108.0 A28.0 28.0 0 0 1 80 192.0 V108.0 A28.0 28.0 0 0 1 108 80 Z M100.0 100.0 H180.0 A20.0 20.0 0 0 1 200.0 120.0 V180.0 A20.0 20.0 0 0 1 180.0 200.0 H120.0 A20.0 20.0 0 0 1 100.0 180.0 V120.0 A20.0 20.0 0 0 1 120.0 100.0 Z"
        fillRule="evenodd"
      ></path>
      <path
        d="M520 80 H632.0 A28.0 28.0 0 0 1 660 108.0 V192.0 A28.0 28.0 0 0 1 632.0 220 H548.0 A28.0 28.0 0 0 1 520 192.0 V108.0 A28.0 28.0 0 0 1 548 80 Z M540.0 100.0 H620.0 A20.0 20.0 0 0 1 640.0 120.0 V180.0 A20.0 20.0 0 0 1 620.0 200.0 H560.0 A20.0 20.0 0 0 1 540.0 180.0 V120.0 A20.0 20.0 0 0 1 560.0 100.0 Z"
        fillRule="evenodd"
      ></path>
      <rect x="120" y="120" rx="20.0" ry="20.0" width="60" height="60"></rect>
      <rect x="560" y="120" rx="20.0" ry="20.0" width="60" height="60"></rect>
      <path
        d="M80 520 H192.0 A28.0 28.0 0 0 1 220 548.0 V632.0 A28.0 28.0 0 0 1 192.0 660 H108.0 A28.0 28.0 0 0 1 80 632.0 V548.0 A28.0 28.0 0 0 1 108 520 Z M100.0 540.0 H180.0 A20.0 20.0 0 0 1 200.0 560.0 V620.0 A20.0 20.0 0 0 1 180.0 640.0 H120.0 A20.0 20.0 0 0 1 100.0 620.0 V560.0 A20.0 20.0 0 0 1 120.0 540.0 Z"
        fillRule="evenodd"
      ></path>
      <rect x="120" y="560" rx="20.0" ry="20.0" width="60" height="60"></rect>
    </svg>
  );
}

export const BRAND_ICONS: Record<string, React.FC<SVGProps<SVGSVGElement>>> = {
  luma: LumaIcon,
  meetup: MeetupIcon,
  linkedin: LinkedInIcon,
  slack: SlackIcon,
  instagram: InstagramIcon,
  github: GitHubIcon,
  youtube: YouTubeIcon,
};
