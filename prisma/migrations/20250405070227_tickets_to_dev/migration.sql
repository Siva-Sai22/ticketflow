-- CreateTable
CREATE TABLE "_AssignedTicket" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AssignedTicket_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AssignedTicket_B_index" ON "_AssignedTicket"("B");

-- AddForeignKey
ALTER TABLE "_AssignedTicket" ADD CONSTRAINT "_AssignedTicket_A_fkey" FOREIGN KEY ("A") REFERENCES "Developer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AssignedTicket" ADD CONSTRAINT "_AssignedTicket_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
