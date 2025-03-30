"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNotification } from "@/contexts/notification-context"
import { fetchWithAuth } from "@/lib/api-config"
import { ShoppingBag, Search, Filter, Tag } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
// Add import for the ItemIllustration component
import { ItemIllustration } from "@/components/store/item-illustration"

interface StoreItem {
  id: number
  name: string
  description: string
  price: number
  type: string
  image_url?: string
}

interface UserProfile {
  meowcoins: number
}

// Update the getItemEmoji function to return appropriate emojis based on item type
// Add this function before the StorePage component

function getItemEmoji(type: string): string {
  switch (type.toLowerCase()) {
    case "hat":
      return "🎩"
    case "glasses":
      return "👓"
    case "collar":
      return "🎀"
    case "background":
      return "🌄"
    default:
      return "🎁"
  }
}

export default function StorePage() {
  const [items, setItems] = useState<StoreItem[]>([])
  const [filteredItems, setFilteredItems] = useState<StoreItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortOption, setSortOption] = useState("price-asc")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const { showNotification } = useNotification()

  useEffect(() => {
    loadStoreItems()
    loadUserProfile()
  }, [])

  useEffect(() => {
    filterAndSortItems()
  }, [items, searchQuery, activeTab, sortOption])

  const loadStoreItems = async () => {
    setIsLoading(true)
    try {
      const data = await fetchWithAuth("/store")
      console.log("Store items:", data)

      if (Array.isArray(data)) {
        setItems(data)
      } else if (data && typeof data === "object" && Array.isArray(data.items)) {
        setItems(data.items)
      } else {
        // Also update the mock data to use more descriptive emojis
        // In the loadStoreItems function, update the mock data items:

        // Mock data for development
        setItems([
          {
            id: 1,
            name: "Wizard Hat",
            description: "A magical hat for your cat",
            price: 100,
            type: "hat",
            image_url: "",
          },
          {
            id: 2,
            name: "Sunglasses",
            description: "Cool shades for your cool cat",
            price: 150,
            type: "glasses",
            image_url: "",
          },
          {
            id: 3,
            name: "Bow Tie",
            description: "Formal attire for fancy occasions",
            price: 75,
            type: "collar",
            image_url: "",
          },
          {
            id: 4,
            name: "Space Background",
            description: "Send your cat to space",
            price: 200,
            type: "background",
            image_url: "",
          },
          {
            id: 5,
            name: "Pirate Hat",
            description: "Arrr, matey!",
            price: 120,
            type: "hat",
            image_url: "",
          },
          {
            id: 6,
            name: "Monocle",
            description: "For the distinguished feline",
            price: 180,
            type: "glasses",
            image_url: "",
          },
          {
            id: 7,
            name: "Beach Background",
            description: "Vacation vibes for your cat",
            price: 220,
            type: "background",
            image_url: "",
          },
          {
            id: 8,
            name: "Crown",
            description: "For the royal cat",
            price: 300,
            type: "hat",
            image_url: "",
          },
          {
            id: 9,
            name: "Bell Collar",
            description: "Hear your cat coming",
            price: 90,
            type: "collar",
            image_url: "",
          },
          {
            id: 10,
            name: "3D Glasses",
            description: "For watching cat movies",
            price: 130,
            type: "glasses",
            image_url: "",
          },
          {
            id: 11,
            name: "Forest Background",
            description: "A natural habitat for your cat",
            price: 210,
            type: "background",
            image_url: "",
          },
          {
            id: 12,
            name: "Santa Hat",
            description: "Festive headwear for the holidays",
            price: 110,
            type: "hat",
            image_url: "",
          },
        ])
      }
    } catch (error) {
      console.error("Error loading store items:", error)
      showNotification("Failed to load store items", "error")

      // Mock data for development
      setItems([
        {
          id: 1,
          name: "Wizard Hat",
          description: "A magical hat for your cat",
          price: 100,
          type: "hat",
          image_url: "",
        },
        {
          id: 2,
          name: "Sunglasses",
          description: "Cool shades for your cool cat",
          price: 150,
          type: "glasses",
          image_url: "",
        },
        {
          id: 3,
          name: "Bow Tie",
          description: "Formal attire for fancy occasions",
          price: 75,
          type: "collar",
          image_url: "",
        },
        {
          id: 4,
          name: "Space Background",
          description: "Send your cat to space",
          price: 200,
          type: "background",
          image_url: "",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserProfile = async () => {
    try {
      const data = await fetchWithAuth("/profiles/me")
      if (data && typeof data === "object") {
        setUserProfile({
          meowcoins: data.meowcoins || 0,
        })
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      setUserProfile({ meowcoins: 0 })
    }
  }

  const filterAndSortItems = () => {
    let result = [...items]

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by type
    if (activeTab !== "all") {
      result = result.filter((item) => item.type === activeTab)
    }

    // Sort items
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    setFilteredItems(result)
  }

  const handlePurchase = async (itemId: number, price: number) => {
    if (!userProfile || userProfile.meowcoins < price) {
      showNotification("Not enough meowcoins to purchase this item", "error")
      return
    }

    setIsPurchasing(true)
    try {
      const response = await fetchWithAuth("/store/buy", {
        method: "POST",
        body: JSON.stringify({ item_id: itemId }),
      })

      if (response && response.success) {
        showNotification("Item purchased successfully!", "success")
        // Update user's meowcoins
        setUserProfile((prev) => (prev ? { ...prev, meowcoins: prev.meowcoins - price } : null))
      } else {
        throw new Error(response.error || "Failed to purchase item")
      }
    } catch (error) {
      console.error("Error purchasing item:", error)
      showNotification("Failed to purchase item", "error")
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterAndSortItems()
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Store</h1>
            <p className="text-muted-foreground">Purchase items for your cat with meowcoins</p>
          </div>
          <div className="flex items-center gap-2 bg-card p-2 rounded-md border">
            <ShoppingBag className="h-5 w-5 text-amber-500" />
            <span className="font-bold">{userProfile?.meowcoins || 0} meowcoins</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search items..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-2">
              Search
            </Button>
          </form>

          <div className="flex items-center gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <span>Sort by</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="hat">Hats</TabsTrigger>
            <TabsTrigger value="glasses">Glasses</TabsTrigger>
            <TabsTrigger value="collar">Collars</TabsTrigger>
            <TabsTrigger value="background">Backgrounds</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="store-grid">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-40 bg-gray-200 dark:bg-gray-700"></div>
                    <CardContent className="p-4">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="store-grid">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="relative overflow-hidden">
                    <div className={`item-badge item-type-${item.type}`}>
                      <Tag className="h-3 w-3 mr-1" />
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </div>
                    {/* Update the store item rendering in the filteredItems.map section */}
                    {/* Replace the existing image div with this: */}
                    <div className="store-item-image">
                      {item.image_url ? (
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ItemIllustration type={item.type} name={item.name} />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="store-item-title">{item.name}</h3>
                      <p className="store-item-description">{item.description}</p>
                      <div className="store-item-price">
                        <span className="store-item-cost">{item.price} meowcoins</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={() => handlePurchase(item.id, item.price)}
                        disabled={isPurchasing || !userProfile || userProfile.meowcoins < item.price}
                      >
                        {userProfile && userProfile.meowcoins < item.price ? "Not enough coins" : "Purchase"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No items found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try a different search term" : "No items available in this category"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>About the Store</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Purchase items for your cat using meowcoins earned from completing lessons and tests. Items can be
              equipped from your profile page after purchase.
            </p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                  <span className="text-blue-600 dark:text-blue-400">🎩</span>
                </div>
                <span className="text-sm font-medium">Hats</span>
                <span className="text-xs text-muted-foreground">Style your cat's head</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                  <span className="text-purple-600 dark:text-purple-400">👓</span>
                </div>
                <span className="text-sm font-medium">Glasses</span>
                <span className="text-xs text-muted-foreground">Cool eyewear</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                  <span className="text-green-600 dark:text-green-400">🎀</span>
                </div>
                <span className="text-sm font-medium">Collars</span>
                <span className="text-xs text-muted-foreground">Neck accessories</span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-2">
                  <span className="text-amber-600 dark:text-amber-400">🌄</span>
                </div>
                <span className="text-sm font-medium">Backgrounds</span>
                <span className="text-xs text-muted-foreground">Change the scenery</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}

