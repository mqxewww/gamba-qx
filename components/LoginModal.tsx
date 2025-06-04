import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useState } from "react";

import { postMagicLink } from "@/domains/auth/auth.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<Props> = ({ isOpen, onClose: onCloseNative }) => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading || isSent) return;

    try {
      setIsLoading(true);

      await postMagicLink(email);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSent(true);
      setIsLoading(false);
    } catch (err) {
      console.log(err);

      setError("Email seems to be invalid. Try with a valid email.");
      setIsLoading(false);
    }
  };

  const onClose = async () => {
    onCloseNative();

    await new Promise((resolve) => setTimeout(resolve, 500));

    setEmail("");
    setError("");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50 font-main text-white"
        onClose={onClose}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-hidden">
          <div className="flex min-h-full items-center justify-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg p-6 space-y-6 shadow-xl rounded-2xl border border-white/10 bg-background-200 transition-all overflow-hidden">
                <DialogTitle className="text-center text-2xl font-semibold">
                  Connexion
                </DialogTitle>

                <div>
                  <AnimatePresence mode="wait">
                    {!isSent ? (
                      <motion.div
                        key="form"
                        initial={false}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div>
                            <input
                              id="email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-2 rounded-lg border border-white/10 bg-background-100 text-white focus:outline-none focus:ring-2 ring-primary transition"
                              placeholder="name@pm.me"
                            />
                            <label
                              htmlFor="email"
                              className="block pl-2 mt-1 text-sm text-gray-300"
                            >
                              Vous recevrez un lien de connexion dans votre
                              boîte mail.
                            </label>
                            <label
                              htmlFor="email"
                              className="block pl-2 pt-2 mt-1 text-sm text-red-300"
                            >
                              {error}
                            </label>
                          </div>

                          <div className="flex justify-center pt-4">
                            <button
                              type="submit"
                              disabled={isLoading || isSent}
                              className="py-2 px-4 rounded-lg border border-white/10 bg-background-100 text-white font-semibold disabled:opacity-50 hover:brightness-125 hover:cursor-pointer focus:outline-none transition"
                            >
                              {isLoading
                                ? "Envoi..."
                                : "Envoyer le lien de connexion"}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="success"
                        initial={false}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -300, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex flex-col items-center justify-center gap-4 text-center"
                      >
                        <div className="rounded-full p-4 bg-green-500">
                          <svg
                            className="w-7 h-7 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <h2 className="text-2xl text-white font-semibold">
                          Lien envoyé !
                        </h2>
                        <p className="text-sm text-gray-300">
                          Vérifiez votre boîte mail pour finaliser votre
                          connexion.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LoginModal;
