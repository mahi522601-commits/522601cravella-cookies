const fields = [
  { name: "fullName", label: "Full Name", type: "text", placeholder: "Your full name" },
  { name: "phone", label: "Phone Number", type: "tel", placeholder: "10-digit phone number" },
  { name: "email", label: "Email Address", type: "email", placeholder: "Optional email address" },
  { name: "city", label: "City", type: "text", placeholder: "City" },
  { name: "district", label: "District", type: "text", placeholder: "District" },
  { name: "pincode", label: "Pincode", type: "text", placeholder: "6-digit pincode" },
];

const CustomerForm = ({ register, errors }) => (
  <section className="card-surface p-6 sm:p-7">
    <div>
      <p className="section-kicker">Step 2</p>
      <h2 className="mt-2 text-2xl font-semibold">Your Details</h2>
    </div>

    <div className="mt-6 grid gap-5 md:grid-cols-2">
      {fields.map((field) => (
        <label key={field.name} className={field.name === "email" ? "md:col-span-2" : ""}>
          <span className="mb-2 block text-sm font-bold text-brand-brown">{field.label}</span>
          <input
            type={field.type}
            placeholder={field.placeholder}
            className="input-field"
            {...register(field.name)}
          />
          {errors[field.name] ? (
            <span className="mt-2 block text-sm font-semibold text-brand-error">
              {errors[field.name]?.message}
            </span>
          ) : null}
        </label>
      ))}
      <label className="md:col-span-2">
        <span className="mb-2 block text-sm font-bold text-brand-brown">Delivery Address</span>
        <textarea
          placeholder="House number, street, landmark, locality"
          className="textarea-field"
          {...register("address")}
        />
        {errors.address ? (
          <span className="mt-2 block text-sm font-semibold text-brand-error">
            {errors.address.message}
          </span>
        ) : null}
      </label>
    </div>
  </section>
);

export default CustomerForm;
