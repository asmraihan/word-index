import type React from "react";
import { View, Pressable } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { word } from "@/lib/storage";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Link } from "expo-router";

type wordProps = word;

export const WordCard: React.FC<wordProps> = ({ id, word, translation, sentence, category }: wordProps) => {
  return (
    <Link href={`/words/${id}`} asChild>
      <Pressable>
        <Card className="rounded-2xl">
          <CardHeader>
            <View className="flex-row gap-4 items-center">
              <CardTitle className="pb-2">
                {word}
              </CardTitle>
              <Badge variant="outline">
                <Text >{category}</Text>
              </Badge>
            </View>

            <View className="flex-col">
              <CardDescription className="text-base font-semibold">
                {translation}
              </CardDescription>
            </View>
          </CardHeader>
          <CardContent />
          <CardFooter className="flex-col gap-3 flex-1">
            <Progress value={10} className="h-2" indicatorClassName="bg-sky-600" />
          </CardFooter>
        </Card>
      </Pressable>
    </Link>
  );
};
