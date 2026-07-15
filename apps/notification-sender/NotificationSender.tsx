import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import axios from "@/lib/axios-compat";
import {Textarea} from "@/components/ui/textarea";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {Toaster} from "@/components/ui/sonner";
import {toast} from "sonner";
import * as LucideReact from 'lucide-react'

interface AppContentProps {
    data: {
        users: Array<{
            id: number;
            fullName: string;
        }>;
    };
}

export default function NotificationSender({data}: AppContentProps) {
    const [selectedUser, setSelectedUser] = useState<string>("");
    const [inputMessage, setInputMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sendToAll, setSendToAll] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                message: inputMessage,
                ...(sendToAll ? {sendToAll: true} : {userId: selectedUser}),
            };

            const res = await axios.post("", payload);
            console.log(res.data);
            toast.success("Сообщение успешно отправлено!");
        } catch (error) {
            console.error(error);
            toast.error("Ошибка при отправке сообщения.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" richColors closeButton/>
            <div className="grid gap-4">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-[400px]">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="send-to-all"
                            checked={sendToAll}
                            onCheckedChange={(value) => {
                                setSendToAll(value as boolean);
                                if (value) {
                                    setSelectedUser("");
                                }
                            }}
                        />
                        <Label htmlFor="send-to-all">Всем пользователям</Label>
                    </div>

                    <div>
                        <Label htmlFor="user-select" className="block mb-2 font-medium">
                            Выберите пользователя:
                        </Label>
                        <Select
                            onValueChange={(value) => setSelectedUser(value)}
                            value={selectedUser}
                            disabled={sendToAll}
                        >
                            <SelectTrigger id="user-select" className="w-full">
                                <SelectValue placeholder="-- Выберите --"/>
                            </SelectTrigger>
                            <SelectContent>
                                {data?.users?.length > 0 ? (
                                    data.users.map((user) => (
                                        <SelectItem value={user.id.toString()} key={user.id}>
                                            {user.fullName}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="" disabled>
                                        Пользователей нет
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="message-input" className="block mb-2 font-medium">
                            Сообщение:
                        </Label>
                        <Textarea
                            id="message-input"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Введите сообщение..."
                        />
                    </div>

                    <div className="flex gap-2 items-center">
                        <Button type="submit" className="w-fit"
                                disabled={isLoading || (!sendToAll && !selectedUser) || !inputMessage.trim()}
                        >
                            {isLoading ? "Отправка..." : "Отправить"}
                        </Button>
                        {isLoading && <LucideReact.Loader2 className="w-6 h-6 animate-spin"/>}
                    </div>
                </form>
            </div>
        </>
    );
}
