import React from "react";
import NavbarLayout from "@theme/Navbar/Layout";
import NavbarContent from "@theme/Navbar/Content";
import ColorGenerator from "@site/src/april-fools/ColorGenerator";

export default function Navbar(): JSX.Element {
  const foolsMode = typeof localStorage !== "undefined" ? localStorage.getItem("foolsMode") : false;

  if ((foolsMode === "true" || foolsMode === null) && ColorGenerator.isAprilFools())
    ColorGenerator.enable();

  return (
    <NavbarLayout>
      <NavbarContent />
    </NavbarLayout>
  );
}
