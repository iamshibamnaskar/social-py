import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar } from "@nextui-org/react";

export default function MakerCard() {
  return (
    <Card className="max-w-[340px]">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://i.ibb.co/bXJ5661/41z-SGMSRSL-UXNa-N-FMjpg-QL85.jpg"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <a href="profile/6759337739a8ffdfdc351daf" ><h4 className="text-small font-semibold leading-none text-default-600">Shibam Naskar</h4></a>
            <h5 className="text-small tracking-tight text-default-400">shibam-naskar</h5>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <p>Just Another Developer</p>
        <a
          href="https://github.com/iamshibamnaskar"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mt-2"
        >
          <img
            src="https://cdn.worldvectorlogo.com/logos/github-icon-2.svg"
            alt="GitHub"
            className="w-5 h-5"
          />
          <span className="text-default-600 hover:underline">GitHub</span>
        </a>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            Designed and developed with love by SHIBAM
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
