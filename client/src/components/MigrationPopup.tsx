/**
 * Design Philosophy: Magisch Winterwonderland
 * - Zachte, dromerige esthetiek met gouden accenten
 * - Ronde vormen en warme tinten
 * - Duidelijke call-to-actions voor jonge gebruikers
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const NEW_SITE_URL = "https://leeschallenge.thomasbell.nl";

export function MigrationPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if we're on a Manus domain
    const isManusUrl = window.location.hostname.includes("manus");
    
    // Show popup on every visit if on Manus URL
    if (isManusUrl) {
      setIsOpen(true);
    }
  }, []);

  const handleGoToNewSite = () => {
    window.location.href = NEW_SITE_URL;
  };

  const handleDismiss = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-cream via-white to-warmSnow border-4 border-gold shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-forestGreen text-center flex items-center justify-center gap-2">
            <span className="text-3xl">🎄</span>
            Nieuwe Locatie!
            <span className="text-3xl">🎄</span>
          </DialogTitle>
          <DialogDescription className="text-base text-warmBrown/80 text-center pt-4 leading-relaxed">
            De Kerst Leeschallenge app heeft een paar kleine wijzigingen ondergaan en is verhuist naar{" "}
            <span className="font-bold text-forestGreen">leeschallenge.thomasbell.nl</span>.
            <br />
            <br />
            Ga naar de nieuwe site en begin opnieuw, of sluit dit venster om je voortgang te behouden en eerst de huidige challenge af te maken.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-col gap-3 pt-4">
          <Button
            onClick={handleGoToNewSite}
            className="w-full bg-gradient-to-r from-forestGreen to-emerald-700 hover:from-emerald-700 hover:to-forestGreen text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            🎁 Ga naar leeschallenge.thomasbell.nl
          </Button>
          
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="w-full border-2 border-gold/30 bg-white/50 hover:bg-warmSnow text-warmBrown font-semibold py-6 text-base"
          >
            Sluit venster en behoud voortgang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
