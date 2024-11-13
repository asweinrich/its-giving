-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'NONPROFIT_MANAGER', 'DONOR');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('NEW_FUNDRAISER', 'DONATION', 'NEW_NONPROFIT', 'USER_JOINED', 'FUNDRAISER_COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "passwordHash" TEXT,
    "oauthProvider" TEXT,
    "oauthProviderId" TEXT,
    "authMethod" TEXT NOT NULL DEFAULT 'email',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "name" TEXT,
    "username" TEXT,
    "bio" TEXT,
    "imageUrl" TEXT,
    "roles" "Role"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "access_token" TEXT,
    "expires_at" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nonprofit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "websiteUrl" TEXT,
    "imageUrl" TEXT,
    "contactEmail" TEXT,
    "regulatoryId" TEXT NOT NULL,
    "regulatoryIdType" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nonprofit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NonprofitDetail" (
    "id" SERIAL NOT NULL,
    "mission" TEXT,
    "history" TEXT,
    "impactStats" JSONB,
    "testimonials" JSONB,
    "additionalInfo" JSONB,
    "nonprofitId" INTEGER NOT NULL,

    CONSTRAINT "NonprofitDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fundraiser" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "goalAmount" DOUBLE PRECISION NOT NULL,
    "currentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nonprofitId" INTEGER NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "coHosts" INTEGER[],

    CONSTRAINT "Fundraiser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donation" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "paymentIntentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "dedication" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "fundraiserId" INTEGER,
    "nonprofitId" INTEGER NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "type" "EventType" NOT NULL,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "nonprofitId" INTEGER,
    "fundraiserId" INTEGER,
    "donationId" INTEGER,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fundraiserId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" SERIAL NOT NULL,
    "nonprofitId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringDonation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nonprofitId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "interval" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nextDonationDate" TIMESTAMP(3),

    CONSTRAINT "RecurringDonation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Nonprofit_regulatoryId_key" ON "Nonprofit"("regulatoryId");

-- CreateIndex
CREATE UNIQUE INDEX "NonprofitDetail_nonprofitId_key" ON "NonprofitDetail"("nonprofitId");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_paymentIntentId_key" ON "Donation"("paymentIntentId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NonprofitDetail" ADD CONSTRAINT "NonprofitDetail_nonprofitId_fkey" FOREIGN KEY ("nonprofitId") REFERENCES "Nonprofit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_nonprofitId_fkey" FOREIGN KEY ("nonprofitId") REFERENCES "Nonprofit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraiser" ADD CONSTRAINT "Fundraiser_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_fundraiserId_fkey" FOREIGN KEY ("fundraiserId") REFERENCES "Fundraiser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_nonprofitId_fkey" FOREIGN KEY ("nonprofitId") REFERENCES "Nonprofit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_nonprofitId_fkey" FOREIGN KEY ("nonprofitId") REFERENCES "Nonprofit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_fundraiserId_fkey" FOREIGN KEY ("fundraiserId") REFERENCES "Fundraiser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "Donation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_fundraiserId_fkey" FOREIGN KEY ("fundraiserId") REFERENCES "Fundraiser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_nonprofitId_fkey" FOREIGN KEY ("nonprofitId") REFERENCES "Nonprofit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringDonation" ADD CONSTRAINT "RecurringDonation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringDonation" ADD CONSTRAINT "RecurringDonation_nonprofitId_fkey" FOREIGN KEY ("nonprofitId") REFERENCES "Nonprofit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
