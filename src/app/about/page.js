export default function about() {
  return (
    <div className="container mx-auto p-4 pt-6 md:p-2 lg:p-4 xl:p-8 mb-16">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>

      <p className="text-lg mb-6">
        Welcome to our blog! We're passionate about sharing insights and stories
        that inspire and inform. Our mission is to provide high-quality content
        that helps readers grow both personally and professionally.
      </p>

      <h2 className="text-2xl font-bold mb-4">Our Story</h2>
      <p className="text-lg mb-6">
        We started this blog because we believe in the power of storytelling and
        knowledge sharing. With years of experience in our field, we aim to
        bring valuable perspectives and expertise to our readers.
      </p>

      <img
        src="/img/aboutimg.png"
        alt="About Image"
        className="w-full h-64 object-contain rounded-md mb-6"
      />
      <p className="text-lg">
        Thank you for visiting our blog! We look forward to connecting with you.
      </p>
    </div>
  );
}
