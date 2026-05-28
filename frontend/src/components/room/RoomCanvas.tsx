import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Application,
  Assets,
  Graphics,
  Sprite,
  Text,
  type Texture,
} from "pixi.js";
import avatarUrl from "../../assets/img/avatar.png";
import floorUrl from "../../assets/img/floor.png";
import { AuthContext } from "../../utils/AuthProvider";
import { RoomContext, type RoomData, type RoomUser } from "../../utils/RoomProvider";

type RoomCanvasProps = {
  roomData: RoomData;
};

type RoomTextures = {
  avatar: Texture;
  floor: Texture;
};

const MIN_TILE_SIZE = 24;
const MAX_TILE_SIZE = 50;
const TEXTURE_SCALE_MODE = "nearest";

const getPlayerLabel = (player: RoomUser) => player.userData.username;

const drawFallbackTile = (x: number, y: number, tileSize: number) =>
  new Graphics()
    .rect(x, y, tileSize, tileSize)
    .fill({ color: 0x2a2433 })
    .rect(x, y, tileSize, tileSize)
    .stroke({ color: 0x3a3345, width: 1 });

const drawFallbackAvatar = (x: number, y: number, tileSize: number) =>
  new Graphics()
    .roundRect(x + 4, y + 4, tileSize - 8, tileSize - 8, 4)
    .fill({ color: 0xacdbd6 });

export default function RoomCanvas({ roomData }: RoomCanvasProps) {
  const appRef = useRef<Application | null>(null);
  const texturesRef = useRef<RoomTextures | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const { userData } = useContext(AuthContext);
  const { move, myCoordinates, usersInRoom } = useContext(RoomContext);
  const [isReady, setIsReady] = useState(false);
  const [tileSize, setTileSize] = useState(MAX_TILE_SIZE);

  const players = useMemo(() => {
    if (!userData) {
      return usersInRoom;
    }

    return [
      { userData, coordinates: myCoordinates },
      ...usersInRoom.filter((user) => user.userData.id !== userData.id),
    ];
  }, [myCoordinates, userData, usersInRoom]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          move("y", -1);
          break;
        case "ArrowDown":
          event.preventDefault();
          move("y", 1);
          break;
        case "ArrowLeft":
          event.preventDefault();
          move("x", -1);
          break;
        case "ArrowRight":
          event.preventDefault();
          move("x", 1);
          break;
      }
    },
    [move]
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    let isDisposed = false;
    let isInitialized = false;
    const app = new Application();
    appRef.current = app;

    const initPixi = async () => {
      await app.init({
        autoDensity: true,
        backgroundAlpha: 0,
        height: roomData.height * MAX_TILE_SIZE,
        resolution: window.devicePixelRatio || 1,
        width: roomData.width * MAX_TILE_SIZE,
      });

      isInitialized = true;

      if (isDisposed) {
        app.destroy(true);
        return;
      }

      app.canvas.className = "room__canvas";
      app.canvas.setAttribute("aria-label", roomData.name);
      app.canvas.setAttribute("role", "img");
      viewport.appendChild(app.canvas);

      const [floor, avatar] = await Promise.all([
        Assets.load<Texture>(floorUrl),
        Assets.load<Texture>(avatarUrl),
      ]);

      floor.source.scaleMode = TEXTURE_SCALE_MODE;
      avatar.source.scaleMode = TEXTURE_SCALE_MODE;

      if (isDisposed) {
        app.destroy(true);
        return;
      }

      texturesRef.current = { avatar, floor };
      setIsReady(true);
    };

    void initPixi();

    return () => {
      isDisposed = true;
      setIsReady(false);
      texturesRef.current = null;
      appRef.current = null;
      if (isInitialized) {
        app.destroy(true, { children: true });
      }
    };
  }, [roomData.height, roomData.name, roomData.width]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const [entry] = entries;
      if (!entry) {
        return;
      }

      const availableWidth = entry.contentRect.width;
      const nextTileSize = Math.max(
        MIN_TILE_SIZE,
        Math.min(MAX_TILE_SIZE, Math.floor(availableWidth / roomData.width))
      );
      setTileSize(nextTileSize);
    });

    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, [roomData.width]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const app = appRef.current;
    if (!app || !isReady) {
      return;
    }

    const textures = texturesRef.current;
    const width = roomData.width * tileSize;
    const height = roomData.height * tileSize;

    app.renderer.resize(width, height);
    app.stage.removeChildren();

    for (let y = 0; y < roomData.height; y++) {
      for (let x = 0; x < roomData.width; x++) {
        const tileX = x * tileSize;
        const tileY = y * tileSize;

        if (textures?.floor) {
          const tile = new Sprite(textures.floor);
          tile.x = tileX;
          tile.y = tileY;
          tile.width = tileSize;
          tile.height = tileSize;
          app.stage.addChild(tile);
        } else {
          app.stage.addChild(drawFallbackTile(tileX, tileY, tileSize));
        }
      }
    }

    players.forEach((player) => {
      const x = player.coordinates.x * tileSize;
      const y = player.coordinates.y * tileSize;

      if (textures?.avatar) {
        const avatar = new Sprite(textures.avatar);
        avatar.x = x;
        avatar.y = y;
        avatar.width = tileSize;
        avatar.height = tileSize;
        app.stage.addChild(avatar);
      } else {
        app.stage.addChild(drawFallbackAvatar(x, y, tileSize));
      }

      const label = new Text({
        text: getPlayerLabel(player),
        style: {
          align: "center",
          fill: 0xffffff,
          fontFamily: "monospace",
          fontSize: 12,
          stroke: { color: 0x000000, width: 3 },
        },
      });
      label.anchor.set(0.5, 0);
      label.x = x + tileSize / 2;
      label.y = y + tileSize - 16;
      app.stage.addChild(label);
    });

    app.render();
  }, [isReady, players, roomData.height, roomData.width, tileSize]);

  return <div className='room__viewport' ref={viewportRef} />;
}
