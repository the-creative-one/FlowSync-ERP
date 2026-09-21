import { X } from "lucide-react";

const styles = [
  "adventurer",
  "avataaars",
  "bottts",
  "lorelei",
  "micah",
  "pixel-art",
];

function AvatarGeneratorModal({ isOpen, onClose, onSelect, userName }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={onClose} />

      <div
        className="
          fixed
          inset-0
          z-[9999]
          flex
          items-center
          justify-center
          p-4
        "
      >
        <div
          className="
            w-full
            max-w-4xl
            bg-white
            dark:bg-[#111827]
            border
            border-gray-200
            dark:border-gray-700
            rounded
            shadow-2xl
            overflow-hidden
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              px-6
              py-5
              border-b
              border-gray-200
              dark:border-gray-700
            "
          >
            <h2 className="text-xl font-bold">Generate Avatar</h2>

            <button onClick={onClose}>
              <X size={22} />
            </button>
          </div>

          <div
            className="
              p-4
              md:p-6
              overflow-y-auto
              max-h-[78vh]
            "
          >
            <div
              className="
                grid
                grid-cols-2
                md:grid-cols-3
                gap-5
              "
            >
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => onSelect(style)}
                  className="
                    p-3 md:p-4
                    rounded
                    border
                    border-gray-200
                    dark:border-gray-700
                    hover:border-[#1D546C]
                    transition
                    bg-white
                    dark:bg-[#1F2937]
                  "
                >
                  <img
                    src={`https://api.dicebear.com/9.x/${style}/svg?seed=${userName}`}
                    alt={style}
                    className="
                      w-20
                      h-20
                      md:w-28
                      md:h-28
                      mx-auto
                    "
                  />

                  <p
                    className="
                      mt-3
                      font-medium
                      capitalize
                    "
                  >
                    {style}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AvatarGeneratorModal;
