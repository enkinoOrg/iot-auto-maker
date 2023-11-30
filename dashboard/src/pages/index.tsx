import { useEffect } from "react";

import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    router.push("/home");
  }, []);
};

export default Home;
