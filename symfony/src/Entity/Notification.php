<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use phpDocumentor\Reflection\Types\Integer;

/**
 * Notification
 *
 * @ORM\Entity
 * @ORM\Table(name="notifications")
 */
class Notification
{
    public function __construct()
    {

    }

    /**
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="smallint", nullable=false)
     */
    private $type;

    /**
     * @var string
     * @ORM\Column(type="text", nullable=false)
     */
    private $message;

    /**
     * @var Account
     * @ORM\ManyToOne(targetEntity="Account", inversedBy="notificationsSent")
     * @ORM\JoinColumn(name="source_account_id", referencedColumnName="id")
     */
    private $sourceAccount;

    /**
     * @var Account
     * @ORM\ManyToOne(targetEntity="Account", inversedBy="notificationsReceived")
     * @ORM\JoinColumn(name="destination_account_id", referencedColumnName="id")
     */
    private $destinationAccount;

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getType(): int
    {
        return $this->type;
    }

    /**
     * @param int $type
     * @return Notification
     */
    public function setType($type): Notification
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return string
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * @param string $message
     * @return Notification
     */
    public function setMessage($message): Notification
    {
        $this->message = $message;

        return $this;
    }

    /**
     * @return Account
     */
    public function getSourceAccount(): Account
    {
        return $this->sourceAccount;
    }

    /**
     * @param Account $sourceAccount
     * @return Notification
     */
    public function setSourceAccount($sourceAccount): Notification
    {
        $this->sourceAccount = $sourceAccount;

        return $this;
    }

    /**
     * @return Account
     */
    public function getDestinationAccount(): Account
    {
        return $this->sourceAccount;
    }

    /**
     * @param Account $destinationAccount
     * @return Notification
     */
    public function setDestinationAccount($destinationAccount): Notification
    {
        $this->destinationAccount = $destinationAccount;

        return $this;
    }
}
