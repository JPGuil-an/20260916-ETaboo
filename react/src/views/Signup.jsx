import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import axiosClient from "../axios-client.js";

const initialForm = { name: "", email: "", birthday: "", mobile_number: "", address: "", user_type: "" };

function dataURLtoBlob(dataURL) {
  const [header, payload] = dataURL.split(",");
  const contentType = header.split(":")[1].split(";")[0];
  const raw = window.atob(payload);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
  return new Blob([bytes], { type: contentType });
}

export default function Signup() {
  const webcamRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [imageCaptured, setImageCaptured] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const update = (event) => setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  const capture = () => {
    const image = webcamRef.current?.getScreenshot();
    if (image) { setImageCaptured(image); setCameraOpen(false); }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!imageCaptured) { setErrors({ id_pic: ["Take a verification photo with your face and ID in the same frame."] }); return; }
    setErrors(null); setIsSubmitting(true); setSuccess("");
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
    payload.append("id_pic", dataURLtoBlob(imageCaptured), `${formData.name || "verification"}.jpg`);
    axiosClient.post("/signup", payload)
      .then(({ data }) => { setSuccess(data.success || "Application submitted for verification."); setFormData(initialForm); setImageCaptured(null); })
      .catch((error) => setErrors(error.response?.data?.errors || { form: ["We could not submit your application. Please try again."] }))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-gradient-to-r from-shop-600 to-shop-500 text-white shadow-md">
        <div className="mx-auto flex min-h-[68px] max-w-6xl items-center justify-between px-4">
          <Link to="/login" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl rounded-bl-sm border-2 border-white text-lg">🌱</span><span><b className="block text-xl">E-Tabo</b><small className="text-white/75">Lantapan marketplace</small></span></Link>
          <Link to="/login" className="rounded border border-white/50 px-4 py-2 text-xs font-semibold hover:bg-white/10">Sign in</Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6 lg:grid-cols-[.72fr_1.28fr] lg:py-10">
        <aside className="overflow-hidden rounded-lg bg-gradient-to-br from-shop-700 to-emerald-400 p-7 text-white shadow-lift lg:p-9">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-white/75">Join the community</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight">Buy fresh. Sell local. Grow together.</h1>
          <p className="mt-4 text-sm leading-6 text-white/85">Create one verified E-Tabo account to shop from local farms or manage your own harvest listings.</p>
          <div className="mt-8 space-y-4 text-sm">
            {["Verified local marketplace", "Fair DA-guided prices", "Direct buyer and farmer access"].map((item) => <div key={item} className="flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-white/20">✓</span>{item}</div>)}
          </div>
          <div className="mt-10 rounded-md bg-white/10 p-4 text-xs leading-5 text-white/80">Your application is reviewed before marketplace access is activated. Prepare a valid ID for the photo step.</div>
        </aside>

        <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="border-b border-stone-100 pb-5"><p className="text-xs font-bold uppercase tracking-wider text-shop-500">Account application</p><h2 className="mt-1 text-2xl font-extrabold text-stone-900">Create your E-Tabo account</h2><p className="mt-1 text-sm text-stone-500">Enter your details exactly as they appear on your ID.</p></div>

          {success && <div className="mt-5 rounded border border-green-200 bg-green-50 p-4 text-sm text-green-800"><b>Application received.</b> {success} <Link to="/login" className="font-bold underline">Return to sign in</Link></div>}
          {errors && <div className="mt-5 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-700"><b>Please check the following:</b><ul className="mt-1 list-disc pl-5">{Object.values(errors).flat().map((message, index) => <li key={index}>{message}</li>)}</ul></div>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-stone-700">Full name</span><input name="name" value={formData.name} onChange={update} required placeholder="Juan Dela Cruz" className="w-full rounded border border-stone-300 px-3.5 py-3 text-sm outline-none focus:border-shop-500 focus:ring-2 focus:ring-shop-100" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-stone-700">Email address</span><input type="email" name="email" value={formData.email} onChange={update} required placeholder="name@example.com" className="w-full rounded border border-stone-300 px-3.5 py-3 text-sm outline-none focus:border-shop-500 focus:ring-2 focus:ring-shop-100" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-stone-700">Mobile number</span><input name="mobile_number" value={formData.mobile_number} onChange={update} required inputMode="numeric" placeholder="09xxxxxxxxx" className="w-full rounded border border-stone-300 px-3.5 py-3 text-sm outline-none focus:border-shop-500 focus:ring-2 focus:ring-shop-100" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-stone-700">Birthday</span><input type="date" name="birthday" value={formData.birthday} onChange={update} required className="w-full rounded border border-stone-300 px-3.5 py-3 text-sm outline-none focus:border-shop-500 focus:ring-2 focus:ring-shop-100" /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-stone-700">Account type</span><select name="user_type" value={formData.user_type} onChange={update} required className="w-full rounded border border-stone-300 px-3.5 py-3 text-sm outline-none focus:border-shop-500 focus:ring-2 focus:ring-shop-100"><option value="">Choose a role</option><option value="0">Buyer</option><option value="1">Seller</option><option value="2">Buyer & Seller</option></select></label>
              <label className="sm:col-span-2"><span className="mb-1.5 block text-xs font-semibold text-stone-700">Complete address</span><textarea name="address" value={formData.address} onChange={update} required rows="3" placeholder="House / Purok, Barangay, Lantapan, Bukidnon" className="w-full resize-none rounded border border-stone-300 px-3.5 py-3 text-sm outline-none focus:border-shop-500 focus:ring-2 focus:ring-shop-100" /></label>
            </div>

            <div className="rounded-md border border-dashed border-stone-300 bg-stone-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div className="flex items-center gap-3">{imageCaptured ? <img src={imageCaptured} alt="Verification preview" className="h-16 w-20 rounded object-cover" /> : <span className="grid h-16 w-20 place-items-center rounded bg-white text-2xl shadow-sm">📷</span>}<div><b className="block text-sm text-stone-800">Identity photo</b><span className="block max-w-sm text-xs leading-5 text-stone-500">Show your face and valid ID clearly in one frame.</span></div></div>
              <button type="button" onClick={() => setCameraOpen(true)} className="mt-3 w-full rounded border border-shop-500 bg-white px-4 py-2.5 text-xs font-bold text-shop-600 hover:bg-shop-50 sm:mt-0 sm:w-auto">{imageCaptured ? "Retake photo" : "Open camera"}</button>
            </div>
            <button type="submit" disabled={isSubmitting} className="shop-btn w-full py-3.5">{isSubmitting ? "Submitting application…" : "Submit for verification"}</button>
            <p className="text-center text-xs text-stone-500">Already registered? <Link to="/login" className="font-bold text-shop-600">Sign in instead</Link></p>
          </form>
        </section>
      </main>

      {cameraOpen && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"><div className="w-full max-w-xl overflow-hidden rounded-lg bg-white shadow-2xl"><div className="flex items-center justify-between border-b p-4"><div><b className="text-sm">Take verification photo</b><p className="text-xs text-stone-500">Keep your face and ID inside the frame.</p></div><button onClick={() => setCameraOpen(false)} className="p-2 text-xl text-stone-500">×</button></div><Webcam ref={webcamRef} mirrored screenshotFormat="image/jpeg" screenshotQuality={0.9} className="aspect-video w-full bg-stone-900 object-cover" videoConstraints={{ facingMode: "user" }} /><div className="flex gap-2 p-4"><button onClick={() => setCameraOpen(false)} className="app-btn-secondary flex-1">Cancel</button><button onClick={capture} className="app-btn-primary flex-1">Capture photo</button></div></div></div>}
    </div>
  );
}
