"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

function dealerFromForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    city: String(formData.get("city") ?? "").trim(),
    postal_code: String(formData.get("postal_code") ?? "").trim() || null,
    country: String(formData.get("country") ?? "NL").toUpperCase().slice(0, 2),
    lat: Number(formData.get("lat")),
    lng: Number(formData.get("lng")),
    phone: String(formData.get("phone") ?? "").trim() || null,
    website: String(formData.get("website") ?? "").trim() || null,
    active: formData.get("active") === "on",
  };
}

export async function createDealer(formData: FormData) {
  const supabase = await requireUser();
  const { error } = await supabase.from("dealers").insert(dealerFromForm(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function updateDealer(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("dealers").update(dealerFromForm(formData)).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function toggleDealer(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";
  const { error } = await supabase.from("dealers").update({ active: !active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function deleteDealer(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("dealers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
