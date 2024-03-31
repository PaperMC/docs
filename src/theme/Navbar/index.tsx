import React from 'react';
import NavbarLayout from '@theme/Navbar/Layout';
import NavbarContent from '@theme/Navbar/Content';
import ColorGenerator from "@site/src/april-fools/ColorGenerator";

export default function Navbar(): JSX.Element {

  const foolsMode = typeof localStorage !== "undefined" ? localStorage.getItem("foolsMode") : false;

  // Check to see if it is April Fools Day
  const today = new Date();
  const isAprilFools = today >= new Date(today.getFullYear(), 3, 1) &&
    today < new Date(today.getFullYear(), 3, 2);

  if ((foolsMode === "true" || foolsMode === null) && isAprilFools)
    ColorGenerator.enable();

  return (
    <NavbarLayout>
      <NavbarContent />
    </NavbarLayout>
  );
}
