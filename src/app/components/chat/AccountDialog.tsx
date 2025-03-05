"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogClose } from "../general/dialog";
import { CircleUserRound, Plus, Trash2 } from "lucide-react";
import { Button } from "../general/button";
import { Command } from "../general/command";
import { Card, CardContent } from "../general/card";
import ProductOrderCommand from "./ProductOrderList";

type Order = {
  id: string;
  name: string;
};

type Product = {
    id: string;
    name: string;
};

interface AccountDialogProps {
  session: { user?: any } | null;
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}

export default function AccountDialog({ isOpen, setOpen, session }: AccountDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="w-[50vw] sm:w-[80vw] bg-[var(--dialog-bg)]">
        <DialogHeader>
          <DialogTitle>Account Details</DialogTitle>
          <DialogDescription>Manage your orders and products.</DialogDescription>
        </DialogHeader>

        {/* User Info */}
        <div className="border-b pb-4">
          <p className="text-lg font-medium">Username: {session?.user?.name || "Guest"}</p>
        </div>

        {/* Orders Section */}
        <ProductOrderCommand />

        {/* Close Button */}
        <DialogClose asChild>
          <Button variant="outline" className="w-full mt-4">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
