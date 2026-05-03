import { useT } from "@/hooks/useT";

import accenture from "@/assets/clients/accenture.png";
import analogia from "@/assets/clients/analogia.png";
import arcelorMittal from "@/assets/clients/arcelor-mittal.png";
import avon from "@/assets/clients/avon.png";
import caledonianSchool from "@/assets/clients/caledonian-school.png";
import ceps from "@/assets/clients/ceps.png";
import citibank from "@/assets/clients/citibank.png";
import csob from "@/assets/clients/csob.png";
import ctGroup from "@/assets/clients/ct-group.png";
import dresserRand from "@/assets/clients/dresser-rand.png";
import elektrotechnika from "@/assets/clients/elektrotechnika.png";
import eon from "@/assets/clients/eon.png";
import fiat from "@/assets/clients/fiat.jpg";
import heidelbergMaterials from "@/assets/clients/heidelberg-materials.png";
import hp from "@/assets/clients/hp.png";
import iir from "@/assets/clients/iir.png";
import johnCrane from "@/assets/clients/john-crane.png";
import kostal from "@/assets/clients/kostal.png";
import prologis from "@/assets/clients/prologis.png";
import saab from "@/assets/clients/saab.jpg";
import sanofiAventis from "@/assets/clients/sanofi-aventis.png";
import scJohnson from "@/assets/clients/sc-johnson.png";
import studentAgency from "@/assets/clients/student-agency.png";
import target from "@/assets/clients/target.png";
import tescan from "@/assets/clients/tescan.png";
import tesco from "@/assets/clients/tesco.png";
import topvision from "@/assets/clients/topvision.gif";
import triton from "@/assets/clients/triton.png";
import vse from "@/assets/clients/vse.gif";
import zentiva from "@/assets/clients/zentiva.jpg";

interface Logo {
  src: string;
  alt: string;
  wide?: boolean;
}

const logos: Logo[] = [
  { src: accenture, alt: "Accenture" },
  { src: analogia, alt: "Analogia" },
  { src: arcelorMittal, alt: "ArcelorMittal" },
  { src: avon, alt: "Avon" },
  { src: caledonianSchool, alt: "Caledonian School" },
  { src: ceps, alt: "ČEPS" },
  { src: citibank, alt: "Citibank" },
  { src: csob, alt: "ČSOB" },
  { src: ctGroup, alt: "CT Group" },
  { src: dresserRand, alt: "Dresser-Rand" },
  { src: elektrotechnika, alt: "Elektrotechnika" },
  { src: eon, alt: "E.ON" },
  { src: fiat, alt: "Fiat" },
  { src: heidelbergMaterials, alt: "Heidelberg Materials" },
  { src: hp, alt: "HP" },
  { src: iir, alt: "IIR", wide: true },
  { src: johnCrane, alt: "John Crane" },
  { src: kostal, alt: "Kostal" },
  { src: prologis, alt: "Prologis" },
  { src: saab, alt: "Saab" },
  { src: sanofiAventis, alt: "Sanofi-Aventis" },
  { src: scJohnson, alt: "SC Johnson" },
  { src: studentAgency, alt: "Student Agency" },
  { src: target, alt: "Target Executive Search" },
  { src: tescan, alt: "Tescan" },
  { src: tesco, alt: "Tesco" },
  { src: topvision, alt: "TopVision" },
  { src: triton, alt: "Triton" },
  { src: vse, alt: "VŠE" },
  { src: zentiva, alt: "Zentiva" },
];

const ClientLogosStrip = () => {
  const t = useT();

  return (
    <section className="pt-24 pb-8 px-6 md:px-12" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xs uppercase tracking-widest text-neutral-500 text-center mb-6 font-medium">
          {t("Trusted by Clients", "Důvěřují")}
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
          {logos.map((logo) => (
            <div
              key={logo.alt}
              className={`group flex items-center justify-center bg-white rounded overflow-hidden ${logo.wide ? "col-span-2" : ""}`}
              style={{ padding: "14px" }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className="object-contain transition-transform duration-200 ease-out group-hover:scale-110 group-hover:brightness-110"
                style={{ maxHeight: "35px", maxWidth: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogosStrip;
