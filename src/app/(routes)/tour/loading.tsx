"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Banner from "@/components/common/Banner";

export default function Loading() {
  return (
    <>
      <Banner title1="Tour du lịch" title2="Quy Nhơn" />
      <div className="animate-pulse">
        {/* Population Section Skeleton */}
        <section className="mx-auto mb-16 flex max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
          <Skeleton className="h-8 w-64 sm:h-10 sm:w-80" />

          {/* Mobile Carousel Skeleton */}
          <ScrollArea className="w-full rounded-md md:hidden">
            <div className="flex w-fit gap-4 pb-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="min-w-[250px] max-w-[300px] flex-1">
                  <Card className="overflow-hidden">
                    <Skeleton className="aspect-square h-40 w-full rounded-t-xl" />
                    <CardContent className="space-y-3 p-4">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Desktop Carousel Skeleton */}
          <div className="hidden gap-4 md:grid md:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="aspect-square h-40 w-full rounded-t-xl" />
                <CardContent className="space-y-3 p-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tours Section Skeleton */}
        <section className="mx-auto mb-16 hidden max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:flex md:max-w-4xl lg:max-w-6xl lg:px-8">
          <Skeleton className="h-8 w-80" />

          <div className="container">
            <div className="flex flex-col gap-6 md:flex-row">
              {/* Left section (Map & Categories) */}
              <div className="w-full lg:basis-[30%]">
                <div className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-lg" /> {/* Map */}
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" /> {/* Category header */}
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-md" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right section (Tours) */}
              <div className="space-y-6 lg:basis-[70%]">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-40" />
                </div>

                <div className="space-y-6">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <Skeleton className="h-48 w-full md:h-auto md:w-1/3" />
                          <div className="w-full space-y-3 p-4 md:w-2/3">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <div className="flex items-end justify-between">
                              <Skeleton className="h-6 w-24" />
                              <Skeleton className="h-10 w-32" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Tours Section Skeleton */}
        <section className="mx-auto mb-16 flex w-full max-w-2xl flex-col gap-6 p-4 md:hidden">
          <Skeleton className="h-8 w-64" />
          <ScrollArea className="w-full rounded-md">
            <div className="flex w-fit gap-4 pb-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="min-w-[250px] max-w-[300px]">
                  <Card className="overflow-hidden">
                    <Skeleton className="aspect-square h-40 w-full" />
                    <CardContent className="space-y-3 p-4">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-full" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Skeleton className="h-10 w-full rounded-md" />{" "}
          {/* View all button */}
        </section>

        {/* Experience Section Skeleton */}
        <section className="mx-auto mb-16 flex max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-72 sm:h-10" />
            <Skeleton className="hidden h-6 w-24 md:block" />{" "}
            {/* "View all" link */}
          </div>
          <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-2 md:px-0">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden border">
                <div className="flex h-full flex-col md:flex-row">
                  <Skeleton className="h-48 w-full md:h-auto md:w-1/3" />
                  <div className="flex-1 space-y-4 p-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Skeleton className="block h-10 w-full md:hidden" />{" "}
          {/* Mobile "View all" button */}
        </section>

        {/* Note Section Skeleton */}
        <section className="mx-auto mb-16 flex max-w-2xl flex-col gap-6 px-4 sm:pb-6 md:max-w-4xl lg:max-w-6xl lg:px-8">
          <Skeleton className="h-8 w-80 sm:h-10" />
          <Card className="w-full">
            <CardContent className="px-12 py-8">
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2 border-b py-4">
                    <Skeleton className="h-6 w-full md:w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
