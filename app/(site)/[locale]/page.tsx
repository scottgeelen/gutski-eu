import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionaries";
import { createClient } from "@/lib/supabase/server";
import type { Dealer } from "@/lib/types";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Story from "@/components/Story";
import Shoot from "@/components/Shoot";
import Collection from "@/components/Collection";
import ConfiguratorTeaser from "@/components/ConfiguratorTeaser";
import Locator from "@/components/Locator";
import Groups from "@/components/Groups";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

export const revalidate = 300; // dealers max 5 min oud

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = await getDictionary(locale as Locale);

  const supabase = await createClient();
  const { data } = await supabase
    .from("dealers")
    .select("*")
    .eq("active", true)
    .order("country")
    .order("city");
  const dealers = (data ?? []) as Dealer[];

  return (
    <>
      <Nav t={t} locale={locale as Locale} />
      <Hero t={t} />
      <Marquee items={t.marquee} />
      <Story t={t} />
      <Shoot t={t} />
      <Collection t={t} />
      <ConfiguratorTeaser t={t} />
      <Locator t={t} dealers={dealers} />
      <Groups t={t} />
      <CtaBanner t={t} />
      <Footer t={t} />
    </>
  );
}
