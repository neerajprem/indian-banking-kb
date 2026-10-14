/// <reference types="astro/client" />
declare namespace App {
  interface Locals {
    citations?: import('./lib/facts').Citations;
    where?: string;
  }
}
