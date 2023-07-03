import React, { useEffect, useState } from "react";

export default function TarjetaTurno({ turno }) {
  

  return (
    <li className="item-dia w-100">{turno.nombre}</li>
  );
}
