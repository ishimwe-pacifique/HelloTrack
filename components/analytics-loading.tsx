"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-md py-4">
        <div className="container mx-auto px-4">
          <div className="h-8 w-64 bg-orange-100 rounded-md animate-pulse" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Title and Controls Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-orange-100 rounded-md animate-pulse" />
            <div className="h-5 w-80 bg-gray-200 rounded-md animate-pulse" />
          </div>
          <div className="mt-4 md:mt-0">
            <div className="h-10 w-44 bg-orange-100 rounded-md animate-pulse" />
          </div>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse border-orange-100">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-orange-200 rounded animate-pulse" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-12 bg-orange-100 rounded mb-2 animate-pulse" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-orange-50 p-1 rounded-lg mb-4 w-fit border border-orange-200">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-9 w-24 bg-orange-100 rounded-md animate-pulse" />
            ))}
          </div>

          {/* Chart Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="animate-pulse border-orange-100">
              <CardHeader>
                <div className="h-6 w-48 bg-orange-100 rounded mb-2 animate-pulse" />
                <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg flex items-center justify-center border border-orange-100">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                      <div
                        className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-amber-400 rounded-full animate-spin"
                        style={{ animationDelay: "0.15s" }}
                      ></div>
                    </div>
                    <div className="text-center">
                      <div className="h-4 w-32 bg-orange-200 rounded mb-1 animate-pulse" />
                      <div className="h-3 w-24 bg-gray-300 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-pulse border-orange-100">
              <CardHeader>
                <div className="h-6 w-40 bg-orange-100 rounded mb-2 animate-pulse" />
                <div className="h-4 w-56 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg flex items-center justify-center border border-orange-100">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 border-8 border-orange-100 rounded-full"></div>
                      <div className="absolute inset-2 w-16 h-16 border-8 border-orange-300 border-t-transparent rounded-full animate-spin"></div>
                      <div
                        className="absolute inset-4 w-12 h-12 border-4 border-amber-400 border-b-transparent rounded-full animate-spin"
                        style={{ animationDelay: "0.3s" }}
                      ></div>
                    </div>
                    <div className="text-center">
                      <div className="h-4 w-28 bg-orange-200 rounded mb-1 animate-pulse" />
                      <div className="h-3 w-20 bg-gray-300 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Loading Message */}
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-3 bg-white px-6 py-4 rounded-full shadow-lg border border-orange-100">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="text-orange-700 font-medium">Loading analytics data...</span>
          </div>
        </div>
      </main>
    </div>
  )
}